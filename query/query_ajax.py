from django.http import JsonResponse
from .models import Csv
from django.shortcuts import render, redirect

def map_csv_file(request):
	data = read_csv(request.FILEs['file'])
	return JsonResponse({'data': data})

def loadCsvToMap(request,pk):
	if request.method == 'POST':
		csvfile = Csv.objects.get(pk=pk)
		data = read_csv(csvfile)
		print(data)
		return JsonResponse({'data': data})

	# return redirect('query')
	# return csvfile
		