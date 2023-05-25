from . import models


def is_voting_allowed(request):
    voting_allowed = models.ToggleVoting.objects.get(id=1)
    return dict(voting_allowed=voting_allowed)
