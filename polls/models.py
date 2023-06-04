from django.db import models
from django.utils.text import slugify
from shortuuidfield import ShortUUIDField


class AbstractTimestampModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Position(AbstractTimestampModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(null=True, blank=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)
        return super().save(*args, **kwargs)


class Candidate(AbstractTimestampModel):
    uuid = ShortUUIDField()
    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to="candidates/")

    def __str__(self):
        try:
            return f"{self.name} - {self.polls.first().position}"
        except AttributeError:
            return self.name


class Poll(AbstractTimestampModel):
    position = models.ForeignKey(Position, related_name="polls", on_delete=models.CASCADE)
    candidate = models.ForeignKey(Candidate, related_name="polls", on_delete=models.CASCADE)
    vote = models.IntegerField(default=0, blank=True, null=True)
    user = models.ManyToManyField("users.User", verbose_name="Voter", blank=True)

    def __str__(self):
        return f"{self.candidate.name} - {self.position} - {self.vote}"

    def save(self, *args, **kwargs):
        if self.id:
            self.vote = self.user.count()
        return super().save(*args, **kwargs)


class ToggleVoting(AbstractTimestampModel):
    voting = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.voting}"
