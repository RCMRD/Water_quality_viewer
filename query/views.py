from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.http import HttpResponseRedirect
from .forms import CsvForm
from .models import Csv
from .filemethods import handle_uploaded_file
from .select import options
import json
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

def query(request):
	csvs = Csv.objects.all()
	try:
		if request.method == 'POST':
			csvform = CsvForm(request.POST, request.FILES)
			if csvform.is_valid():
				csvform.save()
				# file = Csv.objects.get(title="one")
				# print(file.csv)
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

@csrf_exempt
def get_csv(request):
	return_obj = {}
	try:
		if request.method == 'POST':
			info = request.POST
			key = list(info.keys())
			pk = info.get(key[0])
			csvfile = Csv.objects.get(pk=pk)
			data = handle_uploaded_file(csvfile.csv)
			print(data)

			return_obj = {
				'success': 'success',
				'data': data
			}
			print(return_obj)
	except Exception as e:
		return_obj["error"] = "Error Processing Request. Error: "+ str(e)
	return JsonResponse(return_obj, safe=False)