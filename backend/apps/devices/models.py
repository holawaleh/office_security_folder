from django.db import models


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
