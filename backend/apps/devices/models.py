from django.db import models
import uuid


class Device(models.Model):

    DEVICE_STATUS = [
        ("ONLINE", "ONLINE"),
        ("OFFLINE", "OFFLINE"),
        ("MAINTENANCE", "MAINTENANCE"),
    ]

    name = models.CharField(max_length=100)

    serial_number = models.CharField(max_length=100, unique=True, db_index=True)

    location = models.CharField(max_length=255)

    ip_address = models.GenericIPAddressField(null=True, blank=True)

    firmware_version = models.CharField(max_length=50, blank=True)

    api_key = models.CharField(
        max_length=64, unique=True, default=uuid.uuid4
    )

    status = models.CharField(
        max_length=20, choices=DEVICE_STATUS, default="OFFLINE", db_index=True
    )

    last_seen = models.DateTimeField(null=True, blank=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:

        ordering = ["-created_at"]

        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["last_seen"]),
        ]

    def __str__(self):

        return f"{self.name} ({self.serial_number})"


class DeviceCommand(models.Model):

    COMMAND_TYPES = [
        ("UNLOCK", "UNLOCK"),
        ("LOCK", "LOCK"),
        ("SYNC", "SYNC"),
        ("RESTART", "RESTART"),
        ("BUZZER", "BUZZER"),
        ("DISPLAY_MESSAGE", "DISPLAY_MESSAGE"),
    ]

    COMMAND_STATUS = [
        ("PENDING", "PENDING"),
        ("SENT", "SENT"),
        ("ACKNOWLEDGED", "ACKNOWLEDGED"),
        ("FAILED", "FAILED"),
    ]

    device = models.ForeignKey(Device, on_delete=models.CASCADE)

    command_type = models.CharField(max_length=30, choices=COMMAND_TYPES, db_index=True)

    payload = models.JSONField(default=dict, blank=True)

    status = models.CharField(
        max_length=30, choices=COMMAND_STATUS, default="PENDING", db_index=True
    )

    response_message = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    sent_at = models.DateTimeField(null=True, blank=True)

    acknowledged_at = models.DateTimeField(null=True, blank=True)

    class Meta:

        ordering = ["created_at"]

        indexes = [
            models.Index(fields=["device", "status"]),
            models.Index(fields=["command_type"]),
        ]

    def __str__(self):

        return f"{self.device} - {self.command_type} ({self.status})"
