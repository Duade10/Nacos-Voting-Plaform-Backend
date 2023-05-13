from django import forms
from . import models


class LoginForm(forms.Form):
    matric_number = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "placeholder": "Matric Number",
            }
        )
    )

    def clean(self):
        matric_number = self.cleaned_data["matric_number"]
        try:
            user = models.User.objects.get(matric_number=matric_number)
            if user:
                return matric_number
        except models.User.DoesNotExist:
            raise forms.ValidationError("Invalid Detail")


class UserCreationForm(forms.Form):
    first_name = forms.CharField()
    last_name = forms.CharField()
    matric_number = forms.CharField()

    def save(self):
        first_name = self.cleaned_data.get("first_name")
        last_name = self.cleaned_data.get("last_name")
        matric_number = self.cleaned_data.get("matric_number")
        username = matric_number
        user = models.User.objects.create(
            username=username,
            email=" ",
            first_name=first_name,
            last_name=last_name,
            matric_number=matric_number,
        )
        user.set_unusable_password()
        user.is_active = True
        user.save()
