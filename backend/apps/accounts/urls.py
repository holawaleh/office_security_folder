from rest_framework.routers import DefaultRouter

from .views import UserProfileViewSet

router = DefaultRouter()

router.register(r"", UserProfileViewSet, basename="accounts")

urlpatterns = router.urls
