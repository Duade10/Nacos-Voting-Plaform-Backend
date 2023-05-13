from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.urls import reverse, reverse_lazy


class LoggedInOnlyView(LoginRequiredMixin):
    login_url = reverse_lazy("users:signin")


class LoggedOutOnlyView(UserPassesTestMixin):
    def test_func(self):
        return not self.request.user.is_authenticated

    def handle_no_permission(self):
        messages.error(self.request, "Permission Denied!")
        return reverse("users:signin")


class OnlyStaffView(UserPassesTestMixin):
    def test_func(self):
        return not self.request.user.is_staff

    def handle_no_permission(self):
        messages.error(self.request, "Permission Denied")
        return reverse_lazy("polls:index")
