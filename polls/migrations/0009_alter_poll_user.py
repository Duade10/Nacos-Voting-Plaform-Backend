# Generated by Django 4.2.1 on 2023-05-06 19:44

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("polls", "0008_alter_poll_user"),
    ]

    operations = [
        migrations.AlterField(
            model_name="poll",
            name="user",
            field=models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL),
        ),
    ]
