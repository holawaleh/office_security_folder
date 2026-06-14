from rest_framework import serializers

from .models import AccessPerson, AccessEvent


class AccessPersonSerializer(serializers.ModelSerializer):
    display_identifier = serializers.SerializerMethodField()

    class Meta:

        model = AccessPerson

        fields = "__all__"

    def get_display_identifier(self, obj):
        return obj.employee_id or obj.rfid_uid or f"PERSON-{obj.id}"


class AccessEventSerializer(serializers.ModelSerializer):

    class Meta:

        model = AccessEvent

        fields = "__all__"
