from django.contrib import admin

from .models import Event, Tag, Location


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'date_time', 'organizer', 'max_people']
    search_fields = ['name', 'author']
    list_filter = ['tags']


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ['name', 'address']
