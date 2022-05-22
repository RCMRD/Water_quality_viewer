from django.shortcuts import render
from .controls import datasets
from .select import options
import json 

def maps(request):
	context = {
		'datasets': json.dumps(datasets),
		'checks': json.dumps(options)
	}
	return render(request, 'maps/maps.html', context)