from django.http import JsonResponse
from .geechartfunctions import getChart
from maps.visparams import vis, links
import json

def get_chart(request):
	return_obj = {}
	if request.method == 'POST':
		try:
			info = request.POST
			print(info)
			timeS = info.get('startDate')
			timeE = info.get('endDate')
			mission = info.get('mission')
			sensor = info.get('sensor')
			product = info.get('product')
			# scale = info.get('scale', 30)
			scale = 30
			coords = json.loads(info.get('coordinates'))
			reducer = 'min'
			print("here are the coordinates")
			print(coords)
			chartValues = getChart(links[mission][sensor]['addr'], product,timeS, timeE, coords, scale, reducer)
			return_obj["values"] = chartValues
			return_obj["success"] = "success"

			print(return_obj)
		except Exception as e:
			return_obj['error'] = "Error Processing your chart request: "+ str(e)

	return JsonResponse(return_obj)
