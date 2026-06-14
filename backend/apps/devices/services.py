from django.utils import timezone

from apps.access.models import AccessEvent, AccessPerson
from apps.visitors.models import Visitor, VisitorAccessEvent

from .models import Device, DeviceCommand


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


def mark_device_seen(device, data=None):
    data = data or {}

    device.status = "ONLINE"
    device.ip_address = data.get("ip_address", device.ip_address)
    device.firmware_version = data.get("firmware_version", device.firmware_version)
    device.last_seen = timezone.now()
    device.save()

    return device


def get_device_config(device):
    return {
        "device": {
            "id": device.id,
            "name": device.name,
            "serial_number": device.serial_number,
            "location": device.location,
            "status": device.status,
            "firmware_version": device.firmware_version,
        },
        "rules": {
            "heartbeat_interval_seconds": 60,
            "command_poll_interval_seconds": 10,
            "offline_after_seconds": 120,
            "allow_offline_cache": True,
        },
        "features": {
            "rfid": True,
            "fingerprint": True,
            "visitor_access_code": True,
            "remote_commands": True,
        },
    }


def get_device_sync_payload(include_inactive=False):
    people = AccessPerson.objects.all()

    if not include_inactive:
        people = people.filter(is_active=True)

    visitors = Visitor.objects.filter(status__in=["APPROVED", "CHECKED_IN"])

    return {
        "people": [
            {
                "id": person.id,
                "full_name": person.full_name,
                "person_type": person.person_type,
                "employee_id": person.employee_id,
                "rfid_uid": person.rfid_uid,
                "fingerprint_id": person.fingerprint_id,
                "access_level": person.access_level,
                "is_active": person.is_active,
            }
            for person in people
        ],
        "visitors": [
            {
                "id": visitor.id,
                "full_name": visitor.full_name,
                "host_name": visitor.host_name,
                "access_code": visitor.access_code,
                "status": visitor.status,
                "expected_arrival": visitor.expected_arrival,
            }
            for visitor in visitors
        ],
        "synced_at": timezone.now(),
    }


def verify_device_access(device, data):
    auth_method = data.get("auth_method")
    person = None
    visitor = None
    granted = False
    reason = "Credential not recognized"

    if auth_method == "RFID":
        person = AccessPerson.objects.filter(
            rfid_uid=data.get("rfid_uid"), is_active=True
        ).first()

    elif auth_method == "FINGERPRINT":
        person = AccessPerson.objects.filter(
            fingerprint_id=data.get("fingerprint_id"), is_active=True
        ).first()

    elif auth_method == "VISITOR_CODE":
        visitor = Visitor.objects.filter(
            access_code=data.get("access_code"), status="APPROVED"
        ).first()

    if person:
        granted = True
        reason = f"Access granted for {person.full_name}"
        AccessEvent.objects.create(
            person=person,
            device=device,
            auth_method=auth_method,
            access_result="GRANTED",
            notes=reason,
        )

    elif visitor:
        granted = True
        reason = f"Access granted for visitor {visitor.full_name}"
        visitor.status = "CHECKED_IN"
        visitor.check_in_time = timezone.now()
        visitor.save()
        VisitorAccessEvent.objects.create(
            visitor=visitor,
            device=device,
            event_type="ACCESS_GRANTED",
            notes=reason,
        )

    else:
        AccessEvent.objects.create(
            person=None,
            device=device,
            auth_method=auth_method,
            access_result="DENIED",
            notes=reason,
        )

    return {
        "granted": granted,
        "message": reason,
        "unlock_seconds": 5 if granted else 0,
        "person": {
            "id": person.id,
            "full_name": person.full_name,
            "access_level": person.access_level,
            "person_type": person.person_type,
        }
        if person
        else None,
        "visitor": {
            "id": visitor.id,
            "full_name": visitor.full_name,
            "host_name": visitor.host_name,
        }
        if visitor
        else None,
    }


def record_device_event(device, data):
    auth_method = data.get("auth_method")
    person = None
    visitor = None

    if data.get("rfid_uid"):
        person = AccessPerson.objects.filter(rfid_uid=data.get("rfid_uid")).first()

    if data.get("fingerprint_id"):
        person = AccessPerson.objects.filter(
            fingerprint_id=data.get("fingerprint_id")
        ).first()

    if data.get("access_code"):
        visitor = Visitor.objects.filter(access_code=data.get("access_code")).first()

    if visitor:
        VisitorAccessEvent.objects.create(
            visitor=visitor,
            device=device,
            event_type="ACCESS_GRANTED"
            if data.get("access_result") == "GRANTED"
            else "ACCESS_DENIED",
            notes=data.get("notes", ""),
        )

    event = AccessEvent.objects.create(
        person=person,
        device=device,
        auth_method=auth_method,
        access_result=data.get("access_result"),
        notes=data.get("notes", ""),
    )

    return event


def get_pending_commands(device):
    commands = DeviceCommand.objects.filter(device=device, status="PENDING")

    now = timezone.now()
    command_payload = []

    for command in commands:
        command.status = "SENT"
        command.sent_at = now
        command.save()
        command_payload.append(
            {
                "id": command.id,
                "command_type": command.command_type,
                "payload": command.payload,
                "created_at": command.created_at,
            }
        )

    return command_payload


def acknowledge_command(device, data):
    command = DeviceCommand.objects.get(id=data.get("command_id"), device=device)

    command.status = data.get("status")
    command.response_message = data.get("response_message", "")
    command.acknowledged_at = timezone.now()
    command.save()

    return command
