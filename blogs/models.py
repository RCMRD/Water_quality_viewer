from django.db import models
from django.utils import timezone

class Blogs(models.Model):
	title = models.CharField(max_length=100)
	text = models.TextField()
	abstract = models.TextField()
	date = models.DateTimeField(default=timezone.now)