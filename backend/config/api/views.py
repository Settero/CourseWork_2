from djoser.views import UserViewSet as DjoserViewSet
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from users.models import User
from .serializers import (
    UserSerializer,
    TagSerializer,
    LocationSerializer,
    EventSerializer,
    EventStatusSerializer)
from events.models import Tag, Location, Event, Status, EventRegistration
from .permissions import IsOrganizer, EventPermission, IsAdmin, IsUser


class UserViewSet(DjoserViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(
        detail=False,
        methods=['get'],
        permission_classes=[IsAuthenticated],
    )
    def me(self, request, *args, **kwargs):
        return super().me(request, *args, **kwargs)


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = (IsOrganizer,)


class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = (IsOrganizer,)


class EventViewSet(ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = (EventPermission,)

    def get_queryset(self):
        queryset = Event.objects.select_related('organizer')
        if self.action == 'list':
            return queryset.filter(status=Status.APPROVED)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(
        detail=False,
        methods=['get'],
        url_path='admin/pending',
        permission_classes=[IsAdmin],
    )
    def admin_pending(self, request):
        events = Event.objects.select_related('organizer').filter(
            status=Status.PENDING
        )
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=['get'],
        url_path='my',
        permission_classes=[IsOrganizer],
    )
    def my_events(self, request):
        events = Event.objects.select_related('organizer').filter(
            organizer=request.user
        )
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    @action(
        detail=True,
        methods=['patch'],
        url_path='status',
        permission_classes=[IsAdmin],
    )
    def change_status(self, request, pk=None):
        event = self.get_object()

        serializer = EventStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data['status']

        event.status = new_status
        event.save(update_fields=['status'])

        response_serializer = self.get_serializer(event)
        return Response(response_serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['post', 'delete'],
        url_path='register',
        permission_classes=[IsUser],
    )
    def register(self, request, pk=None):
        event = get_object_or_404(
            Event,
            pk=pk,
            status=Status.APPROVED,
        )

        if request.method == 'POST':
            return self.register_to_event(request, event)

        if request.method == 'DELETE':
            return self.cancel_event_registration(request, event)

    @action(
        detail=False,
        methods=['get'],
        url_path='registered',
        permission_classes=[IsUser],
    )
    def registered_events(self, request):
        events = request.user.registered_events.select_related('organizer')

        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    def register_to_event(self, request, event):
        if EventRegistration.objects.filter(
            event=event,
            user=request.user,
        ).exists():
            raise ValidationError(
                {
                    'detail': 'Вы уже зарегистрированы на это мероприятие.'
                }
            )

        registered_count = EventRegistration.objects.filter(
            event=event,
        ).count()

        if registered_count >= event.max_people:
            raise ValidationError(
                {
                    'detail': 'На мероприятие больше нет свободных мест.'
                }
            )

        EventRegistration.objects.create(
            event=event,
            user=request.user,
        )

        serializer = self.get_serializer(event)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def cancel_event_registration(self, request, event):
        registration = EventRegistration.objects.filter(
            event=event,
            user=request.user,
        ).first()

        if registration is None:
            raise ValidationError(
                {
                    'detail': 'Вы не зарегистрированы на это мероприятие.'
                }
            )

        registration.delete()

        serializer = self.get_serializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)
