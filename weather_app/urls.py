from django.urls import path
from . import views

urlpatterns = [
    path("live/", views.api_live, name="api_live"),
    path("history/", views.api_history, name="api_history"),
]
