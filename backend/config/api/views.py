from djoser.views import UserViewSet as DjoserViewSet
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.db.models import Count, F, ExpressionWrapper, IntegerField
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
    EventSerializer,
    EventStatusSerializer,
    EventMiniSerializer)
from events.models import Tag, Event, Status, EventRegistration
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


class EventViewSet(ModelViewSet):
    permission_classes = (EventPermission,)

    def get_queryset(self):
        queryset = Event.objects.select_related('organizer')

        queryset = queryset.annotate(
            current_reg=Count('registrations', distinct=True),
            free_places=ExpressionWrapper(
                F('max_people') - Count('registrations', distinct=True),
                output_field=IntegerField()
            )
        )

        if self.action == 'list':
            return queryset.filter(status=Status.APPROVED)

        return queryset

    def get_serializer_class(self):
        if self.action in ['list', 'admin_pending', 'my_events', 'registered_events']:
            return EventMiniSerializer
        return EventSerializer

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

    @action(
        detail=False,
        methods=['get'],
        url_path='admin/pending',
        permission_classes=[IsAdmin],
    )
    def admin_pending(self, request):
        events = self.get_queryset().filter(status=Status.PENDING)
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=['get'],
        url_path='my',
        permission_classes=[IsOrganizer],
    )
    def my_events(self, request):
        events = self.get_queryset().filter(organizer=request.user)
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    @action(
        detail=True,
        methods=['patch'],
        url_path='status',
        permission_classes=[IsAdmin],
    )
    def change_status(self, request, pk=None):
        event = self.get_queryset().get(pk=pk)

        serializer = EventStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        event.status = serializer.validated_data['status']
        event.save(update_fields=['status'])

        return Response(self.get_serializer(event).data, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['post', 'delete'],
        url_path='register',
        permission_classes=[IsUser],
    )
    def register(self, request, pk=None):
        event = self.get_queryset().get(pk=pk, status=Status.APPROVED)

        if request.method == 'POST':
            return self.register_to_event(request, event)

        return self.cancel_event_registration(request, event)

    @action(
        detail=False,
        methods=['get'],
        url_path='registered',
        permission_classes=[IsUser],
    )
    def registered_events(self, request):
        events = self.get_queryset().filter(
            registrations__user=request.user
        ).distinct()

        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    def register_to_event(self, request, event):
        if EventRegistration.objects.filter(
            event=event,
            user=request.user,
        ).exists():
            raise ValidationError(
                {'detail': 'Вы уже зарегистрированы на это мероприятие.'}
            )
        if event.current_reg >= event.max_people:
            raise ValidationError(
                {'detail': 'На мероприятие больше нет свободных мест.'}
            )

        EventRegistration.objects.create(
            event=event,
            user=request.user,
        )

        return Response(
            self.get_serializer(event).data,
            status=status.HTTP_201_CREATED
        )

    def cancel_event_registration(self, request, event):
        registration = EventRegistration.objects.filter(
            event=event,
            user=request.user,
        ).first()

        if registration is None:
            raise ValidationError(
                {'detail': 'Вы не зарегистрированы на это мероприятие.'}
            )

        registration.delete()

        return Response(
            self.get_serializer(event).data,
            status=status.HTTP_200_OK
        )

    @action(
        detail=True,
        methods=['get'],
        url_path='participants',
        permission_classes=[IsOrganizer],
    )
    def participants(self, request, pk=None):
        event = self.get_queryset().get(pk=pk)

        if event.organizer != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        participants = event.users_registered.order_by(
            'last_name',
            'first_name',
        )
        content = '\n'.join(
            f'{user.first_name} {user.last_name}' for user in participants
        )
        if content:
            content += '\n'

        response = HttpResponse(content, content_type='text/plain; charset=utf-8')
        response['Content-Disposition'] = (
            f'attachment; filename="event_{event.id}_participants.txt"'
        )
        return response
