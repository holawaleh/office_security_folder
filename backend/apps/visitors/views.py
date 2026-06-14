from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Visitor, VisitorAccessEvent
from .serializers import VisitorSerializer, VisitorAccessEventSerializer


class VisitorViewSet(viewsets.ModelViewSet):

    queryset = Visitor.objects.all()

    serializer_class = VisitorSerializer

    permission_classes = [IsAuthenticated]

    filterset_fields = [
        "status",
        "host_name",
        "visit_usage",
    ]

    search_fields = [
        "full_name",
        "phone_number",
        "email",
        "host_name",
        "purpose",
        "access_code",
        "custom_visit_usage",
    ]

    ordering_fields = [
        "created_at",
        "expected_arrival",
        "check_in_time",
    ]


class VisitorAccessEventViewSet(viewsets.ModelViewSet):

    queryset = VisitorAccessEvent.objects.all()

    serializer_class = VisitorAccessEventSerializer

    permission_classes = [IsAuthenticated]

    filterset_fields = [
        "event_type",
        "device",
        "visitor",
    ]

    ordering_fields = [
        "timestamp",
    ]
