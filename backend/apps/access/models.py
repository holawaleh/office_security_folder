from django.db import models
from apps.devices.models import Device


class AccessPerson(models.Model):

    ACCESS_LEVELS = [
        ("ADMIN", "ADMIN"),
        ("STAFF", "STAFF"),
        ("SECURITY", "SECURITY"),
        ("CONTRACTOR", "CONTRACTOR"),
    ]

    full_name = models.CharField(max_length=255, db_index=True)

    employee_id = models.CharField(max_length=100, unique=True, db_index=True)

    rfid_uid = models.CharField(
        max_length=100, unique=True, null=True, blank=True, db_index=True
    )

    fingerprint_id = models.IntegerField(null=True, blank=True, unique=True)

    access_level = models.CharField(
        max_length=30, choices=ACCESS_LEVELS, default="STAFF", db_index=True
    )

    is_active = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:

        ordering = ["full_name"]

    def __str__(self):

        return f"{self.full_name}" f" ({self.employee_id})"


class AccessEvent(models.Model):

    ACCESS_RESULTS = [
        ("GRANTED", "GRANTED"),
        ("DENIED", "DENIED"),
    ]

    AUTH_METHODS = [
        ("RFID", "RFID"),
        ("FINGERPRINT", "FINGERPRINT"),
        ("REMOTE", "REMOTE"),
        ("MANUAL", "MANUAL"),
    ]

    person = models.ForeignKey(
        AccessPerson, on_delete=models.SET_NULL, null=True, blank=True
    )

    device = models.ForeignKey(Device, on_delete=models.CASCADE)

    auth_method = models.CharField(max_length=30, choices=AUTH_METHODS, db_index=True)

    access_result = models.CharField(
        max_length=20, choices=ACCESS_RESULTS, db_index=True
    )

    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    notes = models.TextField(blank=True)

    class Meta:

        ordering = ["-timestamp"]

        indexes = [
            models.Index(fields=["timestamp"]),
            models.Index(fields=["access_result"]),
        ]

    def __str__(self):

        return f"{self.person} - " f"{self.access_result}"
