from rest_framework.routers import DefaultRouter

from .views import AccessPersonViewSet, AccessEventViewSet

router = DefaultRouter()

router.register(r"persons", AccessPersonViewSet, basename="persons")

router.register(r"events", AccessEventViewSet, basename="events")

urlpatterns = router.urls
