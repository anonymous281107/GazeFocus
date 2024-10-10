from django.urls import path

from . import views

urlpatterns = [
    path('testing', views.testingView),
    path('processVideo', views.videoProcess),
    path('getInitialVideo', views.getInitialVideo),
]
