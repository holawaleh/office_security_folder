from rest_framework import viewsets

from .models import UserProfile
from .serializers import UserProfileSerializer


class UserProfileViewSet(viewsets.ModelViewSet):

    queryset = UserProfile.objects.all()

    serializer_class = UserProfileSerializer

    filterset_fields = [
        "role",
    ]

    search_fields = [
        "user__username",
    ]
