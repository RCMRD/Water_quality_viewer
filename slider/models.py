from django.db import models
from django.utils import timezone

class Slider(models.Model):
	img = models.ImageField(upload_to='slider/images', default='slider/images/default.jpg')
	title = models.CharField(max_length=50)
	caption = models.CharField(max_length=70)
	date = models.DateTimeField(default=timezone.now)
	text = models.TextField()

