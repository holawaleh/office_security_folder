from django.contrib import admin

from .models import Visitor, VisitorAccessEvent

admin.site.register(Visitor)

admin.site.register(VisitorAccessEvent)
