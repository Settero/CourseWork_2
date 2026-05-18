from pathlib import Path

from django.core import serializers
from django.core.management.base import BaseCommand

from config.events.models import Event, Tag


class Command(BaseCommand):
    help = 'Загружает тестовые данные в БД'

    def add_arguments(self, parser):
        parser.add_argument(
            '--output', '-o',
            default='test_data.json',
            help='Output JSON file path (default: test_data.json)'
        )

    def handle(self, *args, **options):
        out_path = Path(options['output'])

        tags = list(Tag.objects.all())
        events = list(Event.objects.all())

        objects = tags + events

        if not objects:
            self.stdout.write(self.style.WARNING('No Tag or Event objects found to export.'))

        data = serializers.serialize('json', objects, ensure_ascii=False)

        if out_path.parent:
            out_path.parent.mkdir(parents=True, exist_ok=True)

        out_path.write_text(data, encoding='utf-8')

        self.stdout.write(self.style.SUCCESS(
            f'Exported {len(tags)} tags and {len(events)} events to {out_path}'
        ))
