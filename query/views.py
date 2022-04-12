from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.http import HttpResponseRedirect
from .forms import CsvForm
from .models import Csv
from .select import options
import json


# Create your views here.

def query(request):
	csvs = Csv.objects.all()
	try:
		if request.method == 'POST':
			csvform = CsvForm(request.POST, request.FILES)
			if csvform.is_valid():
				csvform.save()
			csvs = Csv.objects.all()
		else:
			csvform = CsvForm()
		
	except RuntimeError as e:
		print(e + "something went wrong")

	context = {
		'csvform': csvform,
		'csvs': csvs,
		'checks': json.dumps(options)
	}
	return render(request, 'query/query.html', context)

def delete_csv(request, pk):
	if request.method == 'POST':
		csvfile = Csv.objects.get(pk=pk)
		csvfile.csv.delete()
		csvfile.delete()
	return redirect('query')