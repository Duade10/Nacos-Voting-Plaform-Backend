from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    matric_number = models.CharField(max_length=20, null=True)
    voted_positions = models.ManyToManyField("polls.Position")

    def save(self, *args, **kwargs):
        self.first_name = str.capitalize(self.first_name)
        self.last_name = str.capitalize(self.last_name)
        super().save(*args, **kwargs)

    def get_full_name(self) -> str:
        return super().get_full_name()
