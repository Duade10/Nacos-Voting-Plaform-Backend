from django.contrib import admin
from . import models


@admin.register(models.Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ["name", "get_candidate_position"]

    def get_candidate_position(self, obj):
        try:
            return obj.polls.first().position
        except AttributeError:
            return None

    get_candidate_position.short_description = "Position"


@admin.register(models.Position, models.ToggleVoting)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("__str__", "created_at")


@admin.register(models.Poll)
class PollAdmin(admin.ModelAdmin):
    list_display = ("candidate", "position", "vote")
    readonly_fields = ("vote", "user")
