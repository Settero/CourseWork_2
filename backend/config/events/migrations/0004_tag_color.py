# Generated migration for adding color field to Tag

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0003_event_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='tag',
            name='color',
            field=models.CharField(default='#3b82f6', help_text='Формат: #RRGGBB', max_length=7, verbose_name='Цвет тега (hex код)'),
        ),
    ]
