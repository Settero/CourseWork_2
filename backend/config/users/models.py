from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

NAME_MAX_LENGTH = 50
ROLE_MAX_LENGTH = 20

name_validator = RegexValidator(
    regex=r'^[A-Za-zА-Яа-яЁё]+$',
    message='Разрешены только русские и английские буквы.',
    code='invalid_name'
)


class UserRoles(models.TextChoices):
    USER = 'user', 'Пользователь'
    ADMIN = 'admin', 'Администратор'
    ORGANIZER = 'organizer', 'Организатор'


class User(AbstractUser):
    first_name = models.CharField(
        max_length=NAME_MAX_LENGTH,
        verbose_name='Имя',
        validators=[name_validator],)
    last_name = models.CharField(
        max_length=NAME_MAX_LENGTH,
        verbose_name='Фамилия',
        validators=[name_validator],)
    email = models.EmailField(
        unique=True,
        verbose_name='Email',)
    role = models.CharField(
        max_length=ROLE_MAX_LENGTH,
        choices=UserRoles.choices,
        default=UserRoles.USER,
        verbose_name='Роль')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['id']

    def __str__(self):
        return self.email


class Subscription(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='subscriptions',
        verbose_name='Пользователь')
    organizer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='subscribers',
        verbose_name='Организатор')

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'organizer'],
                name='unique_subscription'
                )]
        verbose_name = 'Подписка'

    def __str__(self):
        return f'{self.user} подписан на {self.organizer}'
