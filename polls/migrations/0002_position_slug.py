# Generated by Django 4.2 on 2023-05-04 06:12

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("polls", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="position",
            name="slug",
            field=models.SlugField(blank=True, null=True),
        ),
    ]
