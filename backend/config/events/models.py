from django.db import models

from users.models import User

TAG_MAX_LENGTH = 50
SLUG_MAX_LENGTH = 32
LOCATION_MAX_LENGTH = 50
ADDRESS_MAX_LENGTH = 255
EVENT_NAME_MAX_LENGTH = 100
STATUS_MAX_LENGTH = 20


class Status(models.TextChoices):
    PENDING = 'pending', 'Ожидает проверки'
    APPROVED = 'approved', 'Одобрено'
    REJECTED = 'rejected', 'Отклонено'
    ARCHIVED = 'archived', 'Архивировано'


class BaseModel(models.Model):
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата и время создания')
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата и время последнего обновления')

    class Meta:
        abstract = True


class Tag(BaseModel):
    name = models.CharField(
        max_length=TAG_MAX_LENGTH,
        unique=True,
        verbose_name='Название тега')
    slug = models.SlugField(
        unique=True,
        verbose_name='Уникальный идентификатор тега',
        max_length=TAG_MAX_LENGTH)

    class Meta:
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'
        ordering = ['id']

    def __str__(self):
        return self.name


class Location(BaseModel):
    name = models.CharField(
        max_length=LOCATION_MAX_LENGTH,
        unique=True,
        verbose_name='Название локации')
    address = models.CharField(
        max_length=ADDRESS_MAX_LENGTH,
        unique=True,
        verbose_name='Адрес локации')

    class Meta:
        verbose_name = 'Локация'
        verbose_name_plural = 'Локации'
        ordering = ['id']

    def __str__(self):
        return self.name


class Event(BaseModel):
    name = models.CharField(
        max_length=EVENT_NAME_MAX_LENGTH,
        unique=True,
        verbose_name='Название события')
    description = models.TextField(
        verbose_name='Описание события')
    date_time = models.DateTimeField(
        verbose_name='Дата и время проведения события')
    location = models.ForeignKey(
        Location,
        on_delete=models.PROTECT,
        related_name='events',
        verbose_name='Локация проведения события')
    tags = models.ManyToManyField(
        Tag,
        related_name='events',
        verbose_name='Теги события',
        through='EventTag')
    status = models.CharField(
        max_length=STATUS_MAX_LENGTH,
        choices=Status.choices,
        default=Status.PENDING,
        verbose_name='Статус события')
    max_people = models.PositiveIntegerField(
        verbose_name='Максимальное количество участников',)
    organizer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='organized_events',
        verbose_name='Организатор события')
    users_registered = models.ManyToManyField(
        User,
        related_name='registered_events',
        verbose_name='Зарегистрированные пользователи на событие',
        through='EventRegistration')

    class Meta:
        verbose_name = 'Событие'
        verbose_name_plural = 'События'
        ordering = ['id']

    def __str__(self):
        return self.name


class EventTag(BaseModel):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='event_tags',
        verbose_name='Событие')
    tag = models.ForeignKey(
        Tag,
        on_delete=models.CASCADE,
        related_name='tag_events',
        verbose_name='Тег')

    class Meta:
        verbose_name = 'Тег события'
        verbose_name_plural = 'Теги событий'
        constraints = [
            models.UniqueConstraint(
                fields=['event', 'tag'],
                name='unique_event_tag'
            )]

    def __str__(self):
        return f'{self.event.name} имеет тег {self.tag.name}'


class EventRegistration(BaseModel):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='registrations',
        verbose_name='Событие')
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='event_registrations',
        verbose_name='Пользователь')

    class Meta:
        verbose_name = 'Регистрация на событие'
        verbose_name_plural = 'Регистрации на события'
        constraints = [
            models.UniqueConstraint(
                fields=['event', 'user'],
                name='unique_event_registration'
            )
        ]

    def __str__(self):
        return f'{self.user} зарегистрирован на {self.event.name}'
