from rest_framework import serializers

from .models import Device, DeviceCommand


class DeviceSerializer(serializers.ModelSerializer):

    class Meta:

        model = Device

        fields = "__all__"


class DeviceCommandSerializer(serializers.ModelSerializer):

    class Meta:

        model = DeviceCommand

        fields = "__all__"


class DeviceAuthSerializer(serializers.Serializer):
    serial_number = serializers.CharField(max_length=100)
    api_key = serializers.CharField(max_length=64, required=False, allow_blank=True)

    def validate(self, attrs):
        api_key = attrs.get("api_key") or self.context.get("request").headers.get(
            "X-Device-Key"
        )

        if not api_key:
            raise serializers.ValidationError({"api_key": "api_key required"})

        try:
            device = Device.objects.get(
                serial_number=attrs["serial_number"], api_key=api_key
            )

        except Device.DoesNotExist:
            raise serializers.ValidationError("Invalid device credentials")

        attrs["device"] = device

        return attrs


class DeviceHeartbeatSerializer(DeviceAuthSerializer):
    ip_address = serializers.IPAddressField(required=False, allow_null=True)
    firmware_version = serializers.CharField(
        max_length=50, required=False, allow_blank=True
    )
    uptime_seconds = serializers.IntegerField(required=False, min_value=0)
    free_memory = serializers.IntegerField(required=False, min_value=0)


class DeviceConfigSerializer(DeviceAuthSerializer):
    pass


class DeviceSyncSerializer(DeviceAuthSerializer):
    include_inactive = serializers.BooleanField(default=False)


class DeviceAccessVerifySerializer(DeviceAuthSerializer):
    AUTH_METHODS = [
        ("RFID", "RFID"),
        ("FINGERPRINT", "FINGERPRINT"),
        ("VISITOR_CODE", "VISITOR_CODE"),
    ]

    auth_method = serializers.ChoiceField(choices=AUTH_METHODS)
    rfid_uid = serializers.CharField(max_length=100, required=False, allow_blank=True)
    fingerprint_id = serializers.IntegerField(required=False)
    access_code = serializers.CharField(max_length=50, required=False, allow_blank=True)


class DeviceEventSerializer(DeviceAuthSerializer):
    ACCESS_RESULTS = [
        ("GRANTED", "GRANTED"),
        ("DENIED", "DENIED"),
    ]

    AUTH_METHODS = [
        ("RFID", "RFID"),
        ("FINGERPRINT", "FINGERPRINT"),
        ("REMOTE", "REMOTE"),
        ("MANUAL", "MANUAL"),
        ("VISITOR_CODE", "VISITOR_CODE"),
    ]

    auth_method = serializers.ChoiceField(choices=AUTH_METHODS)
    access_result = serializers.ChoiceField(choices=ACCESS_RESULTS)
    rfid_uid = serializers.CharField(max_length=100, required=False, allow_blank=True)
    fingerprint_id = serializers.IntegerField(required=False)
    access_code = serializers.CharField(max_length=50, required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)


class DevicePollCommandsSerializer(DeviceAuthSerializer):
    pass


class DeviceCommandAckSerializer(DeviceAuthSerializer):
    COMMAND_STATUS = [
        ("ACKNOWLEDGED", "ACKNOWLEDGED"),
        ("FAILED", "FAILED"),
    ]

    command_id = serializers.IntegerField()
    status = serializers.ChoiceField(choices=COMMAND_STATUS)
    response_message = serializers.CharField(required=False, allow_blank=True)
