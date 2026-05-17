from django.utils import timezone

from .models import Device


def process_device_heartbeat(data):

    serial_number = data.get("serial_number")

    if not serial_number:

        return {"success": False, "message": "serial_number required"}

    try:

        device = Device.objects.get(serial_number=serial_number)

    except Device.DoesNotExist:

        return {"success": False, "message": "device not found"}

    device.status = "ONLINE"

    device.ip_address = data.get("ip_address", device.ip_address)

    device.firmware_version = data.get("firmware_version", device.firmware_version)

    device.last_seen = timezone.now()

    device.save()

    return {"success": True, "message": "heartbeat received"}
