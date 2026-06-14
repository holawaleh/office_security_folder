from rest_framework.routers import DefaultRouter

from .views import VisitorAccessEventViewSet, VisitorViewSet

router = DefaultRouter()

router.register(r"events", VisitorAccessEventViewSet, basename="visitor-events")
router.register(r"", VisitorViewSet, basename="visitors")

urlpatterns = router.urls
