from rest_framework.serializers import ModelSerializer
from . import models


class CandidateSerializer(ModelSerializer):
    class Meta:
        model = models.Candidate
        fields = ["name", "image", "uuid"]


class PositionSerializer(ModelSerializer):
    class Meta:
        model = models.Position
        fields = ["title", "slug"]


class PollSerializer(ModelSerializer):
    candidate = CandidateSerializer()
    position = PositionSerializer()

    class Meta:
        model = models.Poll
        fields = "__all__"
