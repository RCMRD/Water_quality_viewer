from django.db import models
from django.utils import timezone

class ImagePosts(models.Model):
	title = models.CharField(max_length=100)
	text = models.TextField()
	abstract = models.TextField()
	img = models.ImageField(upload_to='imgs/imageposts', default='imgs/imageposts/default.jpg')
	date = models.DateTimeField(default=timezone.now)