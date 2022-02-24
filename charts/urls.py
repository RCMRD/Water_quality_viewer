from django.urls import path
from .views import charts
from .charts_ajax import get_chart

urlpatterns = [
    path('', charts, name='charts'),
    path('get_chart/', get_chart, name='get_chart'),
]