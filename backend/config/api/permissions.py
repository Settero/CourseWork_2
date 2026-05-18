from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS
from users.models import UserRoles
from events.models import Status


class IsOrganizer(permissions.BasePermission):
    """Проверяет, является ли пользователь организатором."""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == UserRoles.ORGANIZER
        )


class IsAdmin(permissions.BasePermission):
    """Проверяет, является ли пользователь администратором"""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == UserRoles.ADMIN
        )


class IsUser(permissions.BasePermission):
    """Проверяет, является ли пользователеь обычным пользователем"""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == UserRoles.USER
        )


class EventPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        return (
            request.user.is_authenticated
            and request.user.role == UserRoles.ORGANIZER
        )

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            if obj.status == Status.APPROVED:
                return True

            if not request.user.is_authenticated:
                return False

            if obj.status == Status.PENDING:
                return (
                    obj.organizer == request.user
                    or request.user.role == UserRoles.ADMIN
                )

            if obj.status == Status.REJECTED:
                return obj.organizer == request.user

            return False

        return (
            request.user.is_authenticated
            and request.user.role == UserRoles.ORGANIZER
            and obj.organizer == request.user
        )
