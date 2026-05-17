from django.core.management.base import BaseCommand

from django.utils import timezone

from datetime import timedelta

from apps.devices.models import Device


class Command(BaseCommand):

    help = "Mark inactive devices as OFFLINE"

    def handle(self, *args, **kwargs):

        threshold = timezone.now() - timedelta(minutes=2)

        offline_devices = Device.objects.filter(
            last_seen__lt=threshold, status="ONLINE"
        )

        updated_count = offline_devices.update(status="OFFLINE")

        self.stdout.write(self.style.SUCCESS(f"{updated_count} devices marked OFFLINE"))
