from django.contrib import admin

from .models import AccessPerson, AccessEvent

admin.site.register(AccessPerson)

admin.site.register(AccessEvent)
