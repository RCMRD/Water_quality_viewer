from django.shortcuts import render
from .controls import datasets
import json 

def maps(request):
	context = {
		'datasets' : json.dumps(datasets)
	}
	return render(request, 'maps/maps.html', context)