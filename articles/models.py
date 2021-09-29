from django.db import models
from django.utils import timezone

class Articles(models.Model):
	title = models.CharField(max_length=100)
	text = models.TextField()
	abstract = models.TextField()
	author = models.CharField(max_length=100)
	date = models.DateTimeField(default=timezone.now)