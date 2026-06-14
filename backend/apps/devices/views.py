from rest_framework import status
from rest_framework import viewsets

from rest_framework.decorators import action
from rest_framework.response import Response

from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Device, DeviceCommand
from .serializers import (
    DeviceAccessVerifySerializer,
    DeviceCommandAckSerializer,
    DeviceCommandSerializer,
    DeviceConfigSerializer,
    DeviceEventSerializer,
    DeviceHeartbeatSerializer,
    DevicePollCommandsSerializer,
    DeviceSerializer,
    DeviceSyncSerializer,
)
from .services import (
    acknowledge_command,
    get_device_config,
    get_device_sync_payload,
    get_pending_commands,
    mark_device_seen,
    process_device_heartbeat,
    record_device_event,
    verify_device_access,
)


class DeviceViewSet(viewsets.ModelViewSet):

    queryset = Device.objects.all()

    serializer_class = DeviceSerializer

    filterset_fields = [
        "status",
        "location",
    ]

    search_fields = [
        "name",
        "serial_number",
        "location",
    ]

    ordering_fields = [
        "created_at",
        "last_seen",
        "name",
    ]

    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        device_actions = [
            "heartbeat",
            "config",
            "sync",
            "verify_access",
            "events",
            "poll_commands",
            "ack_command",
        ]

        if self.action in device_actions:
            return [AllowAny()]

        return super().get_permissions()

    @action(detail=False, methods=["post"], url_path="heartbeat")
    def heartbeat(self, request):
        serializer = DeviceHeartbeatSerializer(
            data=request.data, context={"request": request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        mark_device_seen(serializer.validated_data["device"], serializer.validated_data)

        return Response({"message": "heartbeat received"})

    @action(detail=False, methods=["post"], url_path="legacy-heartbeat")
    def legacy_heartbeat(self, request):

        result = process_device_heartbeat(request.data)

        if not result["success"]:

            return Response(
                {"error": result["message"]}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"message": result["message"]})

    @action(detail=False, methods=["post"], url_path="config")
    def config(self, request):
        serializer = DeviceConfigSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        device = mark_device_seen(serializer.validated_data["device"])

        return Response(get_device_config(device))

    @action(detail=False, methods=["post"], url_path="sync")
    def sync(self, request):
        serializer = DeviceSyncSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        mark_device_seen(serializer.validated_data["device"])

        return Response(
            get_device_sync_payload(
                include_inactive=serializer.validated_data["include_inactive"]
            )
        )

    @action(detail=False, methods=["post"], url_path="verify-access")
    def verify_access(self, request):
        serializer = DeviceAccessVerifySerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        device = mark_device_seen(serializer.validated_data["device"])
        result = verify_device_access(device, serializer.validated_data)

        return Response(result)

    @action(detail=False, methods=["post"], url_path="events")
    def events(self, request):
        serializer = DeviceEventSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        device = mark_device_seen(serializer.validated_data["device"])
        event = record_device_event(device, serializer.validated_data)

        return Response(
            {"message": "event recorded", "event_id": event.id},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=["post"], url_path="poll-commands")
    def poll_commands(self, request):
        serializer = DevicePollCommandsSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        device = mark_device_seen(serializer.validated_data["device"])

        return Response({"commands": get_pending_commands(device)})

    @action(detail=False, methods=["post"], url_path="ack-command")
    def ack_command(self, request):
        serializer = DeviceCommandAckSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        device = mark_device_seen(serializer.validated_data["device"])

        try:
            command = acknowledge_command(device, serializer.validated_data)

        except DeviceCommand.DoesNotExist:
            return Response(
                {"error": "command not found"}, status=status.HTTP_404_NOT_FOUND
            )

        return Response(DeviceCommandSerializer(command).data)

    @action(detail=True, methods=["post"], url_path="commands")
    def create_command(self, request, pk=None):
        device = self.get_object()
        serializer = DeviceCommandSerializer(data={**request.data, "device": device.id})
        serializer.is_valid(raise_exception=True)
        command = serializer.save()

        return Response(
            DeviceCommandSerializer(command).data, status=status.HTTP_201_CREATED
        )
