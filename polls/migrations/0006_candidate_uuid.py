# Generated by Django 4.2.1 on 2023-05-06 18:52

from django.db import migrations
import shortuuidfield.fields


class Migration(migrations.Migration):
    dependencies = [
        ("polls", "0005_alter_poll_vote"),
    ]

    operations = [
        migrations.AddField(
            model_name="candidate",
            name="uuid",
            field=shortuuidfield.fields.ShortUUIDField(
                blank=True, editable=False, max_length=22
            ),
        ),
    ]
