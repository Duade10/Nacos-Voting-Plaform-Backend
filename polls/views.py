from django.core.cache import cache
from django.db import transaction
from django.shortcuts import get_object_or_404, redirect, render
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.cache import cache_page
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from users.mixins import LoggedInOnlyView

from . import models, serializers


class Index(LoggedInOnlyView, View):
    def get(self, request, *args, **kwargs):
        return render(request, "polls/index.html")


class GetPollData(APIView):
    @method_decorator(cache_page(60))  # Cache for 60 seconds
    def get(self, request, slug, *args, **kwargs):
        try:
            # Check if the data is available in the cache
            cache_key = f"poll_data_{slug}"
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                return Response(cached_data, status=status.HTTP_200_OK)

            # If data is not in the cache, retrieve it from the database
            polls = models.Poll.objects.filter(position__slug=slug)
            serializer = serializers.PollSerializer(polls, many=True)
            data = serializer.data

            # Store the data in the cache
            cache.set(cache_key, data)

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Vote(APIView):
    """A view for casting votes in the election. Users can only vote once."""

    def post(self, request, *args, **kwargs):
        voting_allowed = models.ToggleVoting.objects.get(id=1)
        position = request.data.get("position", None)
        candidate_id = request.data.get("candidate", None)
        if voting_allowed:
            current_user = request.user
            voted_positions_slug = [position.slug for position in current_user.voted_positions.all()]
            if position not in voted_positions_slug:
                if candidate_id:
                    candidate = get_object_or_404(models.Candidate, uuid=candidate_id)
                    with transaction.atomic():
                        self.update_poll(candidate, current_user)
                        current_user.has_voted = True
                        current_user.save()
                        current_user.voted_positions.add(models.Position.objects.get(slug=position))
                        message = "Done"
            else:
                message = "You have already voted."
        else:
            message = "Voting has closed."
        data = dict(message=message)
        return Response(data)

    def update_poll(self, candidate, user):
        poll = get_object_or_404(models.Poll, candidate=candidate)
        poll.user.add(user)
        poll.vote = poll.user.count()
        poll.save()


class MonitorVotes(LoggedInOnlyView, View):
    def get(self, request, *args, **kwargs):
        voting_allowed = models.ToggleVoting.objects.get(id=1)
        return render(request, "polls/monitor.html", {"voting_allowed": voting_allowed})


class ToggleVoting(LoggedInOnlyView, View):
    def get(self, request, *args, **kwargs):
        url = request.META.get("HTTP_REFERER")
        current_user = request.user
        voting_allowed = models.ToggleVoting.objects.get(id=1)
        if current_user.is_staff:
            if voting_allowed.voting:
                voting_allowed.voting = False
                voting_allowed.save()
            else:
                voting_allowed.voting = True
                voting_allowed.save()
        else:
            # messages.error(request, "Permission Denied")
            pass
        return redirect(url)


class getPositions(APIView):
    def get(self, *args, **kwargs):
        positions = models.Position.objects.all()
        serializer = serializers.PositionSerializer(positions, many=True)
        voted_positions = [position.slug for position in self.request.user.voted_positions.all()]
        data = {"positions": serializer.data, "voted_positions": voted_positions}
        return Response(data, status=status.HTTP_200_OK)
