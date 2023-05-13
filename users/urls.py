from django.urls import path

from . import views

app_name = "users"

urlpatterns = [
    path("logout/", views.log_out, name="logout"),
    path("sign-in/", views.LoginView.as_view(), name="signin"),
    path("voter-creation/", views.UserCreationView.as_view(), name="sign_up"),
]
