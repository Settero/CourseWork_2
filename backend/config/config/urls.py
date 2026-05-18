from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.views import (
    EventViewSet,
    TagViewSet,
    UserViewSet,
)

router = DefaultRouter()
router.register('users', UserViewSet, basename='users')
router.register('tags', TagViewSet, basename='tags')
router.register('events', EventViewSet, basename='events')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
]
