from rest_framework import viewsets

from .models import AccessPerson, AccessEvent

from .serializers import AccessPersonSerializer, AccessEventSerializer


class AccessPersonViewSet(viewsets.ModelViewSet):

    queryset = AccessPerson.objects.all()

    serializer_class = AccessPersonSerializer

    filterset_fields = [
        "access_level",
        "is_active",
    ]

    search_fields = [
        "full_name",
        "employee_id",
        "rfid_uid",
    ]


class AccessEventViewSet(viewsets.ModelViewSet):

    queryset = AccessEvent.objects.all()

    serializer_class = AccessEventSerializer

    filterset_fields = [
        "access_result",
        "auth_method",
    ]

    ordering_fields = [
        "timestamp",
    ]
