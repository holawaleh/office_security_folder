from rest_framework import serializers

from .models import Visitor, VisitorAccessEvent


class VisitorSerializer(serializers.ModelSerializer):
    effective_visit_usage = serializers.SerializerMethodField()

    class Meta:

        model = Visitor

        fields = "__all__"
        read_only_fields = ["created_at"]

    def get_effective_visit_usage(self, obj):
        if obj.visit_usage == "CUSTOM" and obj.custom_visit_usage:
            return obj.custom_visit_usage

        return obj.visit_usage


class VisitorAccessEventSerializer(serializers.ModelSerializer):

    class Meta:

        model = VisitorAccessEvent

        fields = "__all__"
