from rest_framework import status
from rest_framework import viewsets

from rest_framework.decorators import action
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated

from .models import Device
from .serializers import DeviceSerializer
from .services import process_device_heartbeat


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

    @action(detail=False, methods=["post"], url_path="heartbeat")
    def heartbeat(self, request):

        result = process_device_heartbeat(request.data)

        if not result["success"]:

            return Response(
                {"error": result["message"]}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"message": result["message"]})
