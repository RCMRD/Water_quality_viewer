from django.urls import path
from .views import query, delete_csv
from .query_ajax import get_csv
from .query_ajax import query_csv

urlpatterns = [
    path('', query, name='query'),
    path('<int:pk>/', delete_csv, name='delete_csv'),
    path('get_csv', get_csv, name='get_csv'),
    path('query_csv', query_csv, name='query_csv')
]