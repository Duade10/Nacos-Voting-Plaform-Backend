# Generated by Django 4.2.1 on 2023-05-06 19:43

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("polls", "0007_alter_poll_user_alter_vote_candidate"),
    ]

    operations = [
        migrations.AlterField(
            model_name="poll",
            name="user",
            field=models.ManyToManyField(null=True, to=settings.AUTH_USER_MODEL),
        ),
    ]
