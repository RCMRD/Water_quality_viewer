from django.http import JsonResponse
import csv
import pandas as pd

def handle_uploaded_file(f):
    # with open('my_file.csv') as f:
    #     for line in csv.DictReader(f, fieldnames=('id', 'lat', 'lon')):
    #         print(line)
    file = pd.read_csv(f)
    return file.to_dict(orient='records')