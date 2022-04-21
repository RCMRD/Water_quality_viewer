from django.urls import path
from .views import contact

urlpatterns = [
    # path('', home, name='home'),
    path('contact/', contact, name='contact')
]