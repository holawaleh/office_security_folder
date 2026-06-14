from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import AccessPerson, AccessEvent

from .serializers import AccessPersonSerializer, AccessEventSerializer


class AccessPersonViewSet(viewsets.ModelViewSet):

    queryset = AccessPerson.objects.all()

    serializer_class = AccessPersonSerializer

    permission_classes = [IsAuthenticated]

    filterset_fields = [
        "access_level",
        "is_active",
        "person_type",
    ]

    search_fields = [
        "full_name",
        "employee_id",
        "rfid_uid",
        "email",
        "phone_number",
    ]


class AccessEventViewSet(viewsets.ModelViewSet):

    queryset = AccessEvent.objects.all()

    serializer_class = AccessEventSerializer

    permission_classes = [IsAuthenticated]

    filterset_fields = [
        "access_result",
        "auth_method",
    ]

    ordering_fields = [
        "timestamp",
    ]
