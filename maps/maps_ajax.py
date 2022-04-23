from django.http import JsonResponse
from .geemapfunctions import getImage
from .visparams import vis, links

def get_map(request):
	return_obj = {}
	if request.method =="POST":
		try:
			info = request.POST
			mtype = info.get('type')
			timeS = info.get('startDate')
			timeE = info.get('endDate')
			mission = info.get('mission')
			sensor = info.get('sensor')
			product = info.get('product')
			if mtype == 'wq':
				image_object = getImage(links[mission][sensor]['addr'], product, vis[product], mtype, timeS, timeE)
			elif mtype == 'lulc':
				image_object = getImage(links[mtype]['all']['addr'], product, vis['lulc'], mtype)
				print(image_object)

			return_obj["url"] = image_object
			return_obj["success"] = "success"

			print(return_obj)
		except Exception as e:
			return_obj["error"] = str(e)
	return JsonResponse(return_obj)