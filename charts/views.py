from django.shortcuts import render
from maps.controls import datasets
import json

def charts(request):
	context = {
		'datasets' : json.dumps(datasets)
	}
	return render (request, 'charts/charts.html', context)