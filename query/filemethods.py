from django.http import JsonResponse
import csv
import pandas as pd

def handle_uploaded_file(f):
    file = pd.read_csv(f)
    return JsonResponse(file)