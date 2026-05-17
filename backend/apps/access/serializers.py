from rest_framework import serializers

from .models import AccessPerson, AccessEvent


class AccessPersonSerializer(serializers.ModelSerializer):

    class Meta:

        model = AccessPerson

        fields = "__all__"


class AccessEventSerializer(serializers.ModelSerializer):

    class Meta:

        model = AccessEvent

        fields = "__all__"
