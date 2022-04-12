from django.http import JsonResponse
from .models import Csv
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from .filemethods import handle_uploaded_file
from .geefunctions import getTimeSeriesByCollectionAndIndex as gtci
from .select import options
import pandas as pd
import json

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

			return_obj = {
				'success': 'success',
				'data': data
			}

	except Exception as e:
		return_obj["error"] = "Error Processing Request. Error: "+ str(e)
	return JsonResponse(return_obj, safe=False)

@csrf_exempt
def query_csv(request):
	return_obj = {}

	if request.method == "POST":
			try:
					info = request.POST
					time_start = info.get('startDate', None)
					time_end = info.get('endDate', None)
					reducer = info.get('reducer', None)
					scale = float(info.get('scale', 30))
					pk = info.get('filetitle')
					csvfile = Csv.objects.get(pk=pk)
					latlonpairs = handle_uploaded_file(csvfile.csv)

					my_df = pd.DataFrame()
					for latlon in latlonpairs:
						geometry = (latlon['lon'], latlon['lat'])
						for collc in info:
							if (collc != 'startDate' and collc != 'endDate' and collc != 'filetitle'):
								collection = options[collc]['link']
								indexName = options[collc]['index']
								platform = options[collc]['platform']
								sensor = options[collc]['sensor']
								timeseries = gtci(collection, indexName, scale, geometry, time_start, time_end, reducer)
								new_pd = pd.DataFrame(timeseries, columns=list(("time","value")))
								new_pd["product"] = indexName
								new_pd["sensor"] = sensor
								new_pd["platform"] = platform
								new_pd["geom_id"] = latlon['id']
								new_pd["value"]=new_pd["value"].fillna(-9999)
								my_df = my_df.append(new_pd, ignore_index=True)

					data = my_df.to_dict(orient='records')
					return_obj = {
							'success': 'success',
							'dataframe': data
							}

			except Exception as e:
					return_obj["error"] = "Error Processing Request. Error: "+ str(e)

	return JsonResponse(return_obj, safe=False)
		