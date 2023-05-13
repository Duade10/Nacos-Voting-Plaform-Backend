from django.db import transaction
from django.shortcuts import get_object_or_404, redirect, render
from django.views import View
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from users.mixins import LoggedInOnlyView

from . import models, serializers


class Index(LoggedInOnlyView, View):
    def get(self, request, *args, **kwargs):
        return render(request, "polls/index.html")


class GetPollData(APIView):
    def get(self, request, slug, *args, **kwargs):
        try:
            polls = models.Poll.objects.filter(position__slug=slug)
            serializer = serializers.PollSerializer(polls, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Vote(APIView):
    """A view for casting votes in the election. Users can only vote once."""

    def post(self, request, *args, **kwargs):
        voting_allowed = models.ToggleVoting.objects.get(id=1)
        if voting_allowed:
            current_user = request.user
            if not current_user.has_voted:
                president_uuid = request.data.get("president", None)
                vice_president_uuid = request.data.get("vpresident", None)

                if president_uuid and vice_president_uuid:
                    president = get_object_or_404(models.Candidate, uuid=president_uuid)
                    vice_president = get_object_or_404(models.Candidate, uuid=vice_president_uuid)

                    with transaction.atomic():
                        self.update_poll(president, current_user)
                        self.update_poll(vice_president, current_user)
                        self.create_vote(current_user, president, vice_president)
                        current_user.has_voted = True
                        current_user.save()
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

    def create_vote(self, user, president, vice_president):
        try:
            vote = models.Vote.objects.get(user=user)
        except models.Vote.DoesNotExist:
            vote = models.Vote.objects.create(user=user)
        vote.candidate.add(president)
        vote.candidate.add(vice_president)
        vote.save()


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
