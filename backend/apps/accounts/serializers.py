from rest_framework import serializers

from django.contrib.auth.models import User

from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    email = serializers.EmailField(source="user.email", required=False, allow_blank=True)
    first_name = serializers.CharField(
        source="user.first_name", required=False, allow_blank=True
    )
    last_name = serializers.CharField(
        source="user.last_name", required=False, allow_blank=True
    )
    full_name = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:

        model = UserProfile

        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "role",
            "phone_number",
            "password",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "full_name"]

    def get_full_name(self, obj):
        full_name = obj.user.get_full_name().strip()

        return full_name or obj.user.username

    def create(self, validated_data):
        user_data = validated_data.pop("user", {})
        password = validated_data.pop("password", None)

        user = User(
            username=user_data.get("username"),
            email=user_data.get("email", ""),
            first_name=user_data.get("first_name", ""),
            last_name=user_data.get("last_name", ""),
        )

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save()

        return UserProfile.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        password = validated_data.pop("password", None)

        for attr, value in user_data.items():
            setattr(instance.user, attr, value)

        if password:
            instance.user.set_password(password)

        instance.user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance
