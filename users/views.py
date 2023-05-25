from django.contrib import messages
from django.contrib.auth import login, logout
from django.shortcuts import redirect
from django.urls import reverse
from django.views.generic import FormView, View
from django.http import JsonResponse

from . import forms, mixins, models


def log_out(request, *args, **kwargs):
    logout(request)
    messages.success(request, "See you later")
    return redirect(reverse("users:signin"))


class LoginView(mixins.LoggedOutOnlyView, FormView):
    template_name = "users/signin.html"
    form_class = forms.LoginForm

    def form_valid(self, form):
        matric_number = form.cleaned_data
        try:
            user = models.User.objects.get(matric_number=matric_number)
            login(self.request, user)
        except models.User.DoesNotExist:
            return reverse(redirect("users:signin"))
        return redirect(self.get_success_url())

    def get_success_url(self):
        messages.success(self.request, f"Welcome {self.request.user.first_name}")
        return reverse("polls:index")


class UserCreationView(mixins.LoggedOutOnlyView, FormView):
    template_name = "users/create.html"
    form_class = forms.UserCreationForm

    def form_valid(self, form):
        form.save()
        matric_number = form.cleaned_data.get("matric_number")
        first_name = form.cleaned_data.get("first_name")
        last_name = form.cleaned_data.get("last_name")
        user = models.User.objects.filter(matric_number, first_name, last_name)
        if user.exists():
            return redirect("users/create.html")


class HasUserVoted(mixins.LoggedInOnlyView, View):
    def get(self, request, position_slug, *args, **kwargs):
        current_user = request.user
        voted_position_slugs = [position.slug for position in current_user.voted_positions.all()]
        print(position_slug in voted_position_slugs)
        if position_slug in voted_position_slugs:
            result = True
        else:
            result = False
        return JsonResponse({"result": result})
