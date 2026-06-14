from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import UserProfile
from .serializers import UserProfileSerializer


class UserProfileViewSet(viewsets.ModelViewSet):

    queryset = UserProfile.objects.all()

    serializer_class = UserProfileSerializer

    permission_classes = [IsAuthenticated]

    filterset_fields = [
        "role",
    ]

    search_fields = [
        "user__username",
    ]

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[AllowAny],
        url_path="register",
    )
    def register(self, request):
        data = request.data.copy()

        data["role"] = "SECURITY"

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        profile = serializer.save()

        return Response(
            self.get_serializer(profile).data,
            status=status.HTTP_201_CREATED,
        )
