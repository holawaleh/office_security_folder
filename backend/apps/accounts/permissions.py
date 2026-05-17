from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):

    def has_permission(self, request, view):

        return (
            hasattr(request.user, "userprofile")
            and request.user.userprofile.role == "SUPER_ADMIN"
        )


class IsAdminOrSuperAdmin(BasePermission):

    def has_permission(self, request, view):

        if not hasattr(request.user, "userprofile"):

            return False

        return request.user.userprofile.role in [
            "SUPER_ADMIN",
            "ADMIN",
        ]
