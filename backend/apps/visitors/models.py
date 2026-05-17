from django.db import models


class Visitor(models.Model):

    VISITOR_STATUS = [
        ("PENDING", "PENDING"),
        ("APPROVED", "APPROVED"),
        ("DENIED", "DENIED"),
        ("CHECKED_IN", "CHECKED_IN"),
        ("CHECKED_OUT", "CHECKED_OUT"),
    ]

    full_name = models.CharField(max_length=255, db_index=True)

    phone_number = models.CharField(max_length=20, blank=True)

    email = models.EmailField(blank=True)

    host_name = models.CharField(max_length=255, db_index=True)

    purpose = models.TextField()

    access_code = models.CharField(max_length=50, unique=True, db_index=True)

    status = models.CharField(
        max_length=30, choices=VISITOR_STATUS, default="PENDING", db_index=True
    )

    approved_by = models.CharField(max_length=255, blank=True)

    expected_arrival = models.DateTimeField(null=True, blank=True)

    check_in_time = models.DateTimeField(null=True, blank=True)

    # check_out_time = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:

        ordering = ["-created_at"]

        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["host_name"]),
        ]

    def __str__(self):

        return f"{self.full_name}" f" ({self.status})"


from apps.devices.models import Device


class VisitorAccessEvent(models.Model):

    EVENT_TYPES = [
        ("CHECK_IN", "CHECK_IN"),
        # ("CHECK_OUT", "CHECK_OUT"),
        ("ACCESS_GRANTED", "ACCESS_GRANTED"),
        ("ACCESS_DENIED", "ACCESS_DENIED"),
    ]

    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE)

    device = models.ForeignKey(Device, on_delete=models.CASCADE)

    event_type = models.CharField(max_length=30, choices=EVENT_TYPES, db_index=True)

    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    notes = models.TextField(blank=True)

    class Meta:

        ordering = ["-timestamp"]

    def __str__(self):

        return f"{self.visitor} - " f"{self.event_type}"
