from django.shortcuts import render
from django.http import HttpResponseRedirect
from .forms import UploadFileForm as uff
from .filemethods import handle_uploaded_file
from .select import options
import json

# Create your views here.

def query(request):
	content = ()
	if request.method == 'POST':
		form = uff(request.POST, request.FILES)
		print(form)
		if form.is_valid():
			content = handle_uploaded_file(request.FILES['file'])
			# return HttpResponseRedirect('')
	else:
		form = uff()
	context = {
		'form': form,
		'filecontent': content,
		'checks': json.dumps(options)
	}
	return render(request, 'query/query.html', context)