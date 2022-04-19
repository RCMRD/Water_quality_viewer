from django.shortcuts import render
from .models import SiteArticles

# Create your views here.
def about(request):
	aboutContent = SiteArticles.objects.get(title='About')
	imglist = aboutContent.images.all()
	context = {
		'about_content': aboutContent,
		'images': imglist
	}
	return render(request, 'articles/about.html', context)