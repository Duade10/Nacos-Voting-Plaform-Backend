from django.urls import path
from . import views

app_name = "polls"

urlpatterns = [
    path("", views.Index.as_view(), name="index"),
    path("monitor/", views.MonitorVotes.as_view(), name="monitor"),
    path("get-poll-data/<str:slug>/", views.GetPollData.as_view(), name="get_poll_data"),
    path("vote/", views.Vote.as_view(), name="vote"),
    path("toggle-voting/", views.ToggleVoting.as_view(), name="toggle_voting"),
]
