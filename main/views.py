from django.shortcuts import render
from slider.models import Slider
from blogs.models import Blogs
from articles.models import Articles
from imageposts.models import ImagePosts

# def home(request):

# 	sliders = Slider.objects.all()
# 	blogs = Blogs.objects.all()
# 	articles = Articles.objects.all()
# 	imageposts = ImagePosts.objects.all()

# 	context = {
# 		'sliders' : sliders,
# 		'blogs' : blogs, 
# 		'articles' : articles,
# 		'imageposts' : imageposts
# 	}
# 	return render(request, 'main/home.html', context)

def contact(request):
	context = {}
	return render(request, 'main/contact.html', context)