from django.db import models

from django.contrib.auth.models import User


class UserProfile(models.Model):

    ROLE_CHOICES = [
        ("SUPER_ADMIN", "SUPER_ADMIN"),
        ("ADMIN", "ADMIN"),
        ("SECURITY", "SECURITY"),
        ("RECEPTION", "RECEPTION"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    role = models.CharField(
        max_length=30, choices=ROLE_CHOICES, default="SECURITY", db_index=True
    )

    phone_number = models.CharField(max_length=20, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):

        return f"{self.user.username} - {self.role}"
