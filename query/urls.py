from django.urls import path
from .views import query, delete_csv, get_csv
# from .query_ajax import map_csv_file as mcf
# from .query_ajax import loadCsvToMap as lcm

urlpatterns = [
    path('', query, name='query'),
    path('<int:pk>/', delete_csv, name='delete_csv'),
    path('get_csv', get_csv, name='get_csv'),
]