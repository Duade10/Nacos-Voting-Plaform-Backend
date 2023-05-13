from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from . import models


@admin.register(models.User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        "username",
        "first_name",
        "last_name",
        "matric_number",
        "email",
        "is_staff",
        "is_superuser",
        "has_voted",
    )
    # list_filter = ("superhost", "language", "currency")

    fieldsets = UserAdmin.fieldsets + (("Custom User Fields", {"fields": ("matric_number", "has_voted")}),)

    search_fields = ("username__icontains", "first_name")
