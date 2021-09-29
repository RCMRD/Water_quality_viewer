from django.urls import path
from .views import maps
from .maps_ajax import get_map

urlpatterns = [
    path('', maps, name='maps'),
    path('get_map/', get_map, name='get_map')
]