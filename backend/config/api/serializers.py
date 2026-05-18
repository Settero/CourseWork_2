from rest_framework import serializers

from users.models import User, Subscription
from events.models import Event, Tag, Status


class UserSerializer(serializers.ModelSerializer):
    """Сериализатор для модели User."""
    is_subscribed = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'role',
            'is_subscribed')

    def get_is_subscribed(self, obj):
        request = self.context.get('request')
        return bool(
            request
            and request.user.is_authenticated
            and Subscription.objects.filter(
                user=request.user,
                organizer=obj).exists())


class TagSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Tag."""

    class Meta:
        model = Tag
        fields = ('id', 'slug', 'name')


class EventMiniSerializer(serializers.ModelSerializer):
    free_places = serializers.IntegerField(read_only=True)
    current_reg = serializers.IntegerField(read_only=True)

    class Meta:
        model = Event
        fields = (
            'id',
            'name',
            'date_time',
            'location',
            'status',
            'current_reg',
            'free_places',
        )


class UserSubscriptionSerializer(UserSerializer):
    """ Сериалайзер для обработки подписок"""
    events = serializers.SerializerMethodField()
    events_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = UserSerializer.Meta.fields + ('events', 'events_count',)

    def get_events(self, obj):
        request = self.context.get('request')
        if not request:
            return EventMiniSerializer(obj.events.all(), many=True).data
        limit = request.query_params.get('events_limit')
        events = obj.events.all()
        if limit is not None:
            try:
                limit = int(limit)
            except (TypeError, ValueError):
                limit = None
        if limit and limit > 0:
            events = events[:limit]
        return EventMiniSerializer(events, many=True).data

    def get_events_count(self, obj):
        return obj.events.count()


class SubscribeCreateSerializer(serializers.ModelSerializer):
    """Сериалайзер для создания подписки."""

    class Meta:
        model = Subscription
        fields = ('user', 'organizer')

    def validate(self, attrs):
        user = attrs['user']
        organizer = attrs['organizer']
        if user == organizer:
            raise serializers.ValidationError(
                {'detail': 'Нельзя подписаться на себя'}
            )
        if Subscription.objects.filter(
            user=user,
            organizer=organizer
        ).exists():
            raise serializers.ValidationError(
                {'detail': 'Подписка уже существует'}
            )
        return attrs

    def to_representation(self, instance):
        return UserSubscriptionSerializer(
            instance.organizer,
            context=self.context
        ).data


class EventSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели Event."""
    tags = TagSerializer(many=True, read_only=True)
    organizer = UserSerializer(read_only=True)
    users_registered = UserSerializer(many=True, read_only=True)
    free_places = serializers.IntegerField(read_only=True)
    current_reg = serializers.IntegerField(read_only=True)

    class Meta:
        model = Event
        fields = (
            'id',
            'name',
            'description',
            'date_time',
            'location',
            'tags',
            'status',
            'max_people',
            'current_reg',
            'organizer',
            'free_places',
            'users_registered')

    def create(self, validated_data):
        # Accept tags from incoming request (list of ids) and attach them to the event
        tags = self.initial_data.get('tags', None)
        event = Event.objects.create(**validated_data)
        if tags is not None:
            try:
                tag_ids = [int(t) for t in tags]
                event.tags.set(tag_ids)
            except Exception:
                # ignore invalid tag ids; validation can be added if needed
                pass
        return event

    def update(self, instance, validated_data):
        tags = self.initial_data.get('tags', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tags is not None:
            try:
                tag_ids = [int(t) for t in tags]
                instance.tags.set(tag_ids)
            except Exception:
                pass
        return instance


class EventStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Status.choices)
