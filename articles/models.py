from django.db import models
from django.utils import timezone

class Articles(models.Model):
	title = models.CharField(max_length=100)
	text = models.TextField()
	abstract = models.TextField()
	author = models.CharField(max_length=100)
	date = models.DateTimeField(default=timezone.now)


class SiteArticles(models.Model):
	title = models.CharField(max_length=100)
	text = models.TextField()
	author = models.CharField(max_length=100)
	date = models.DateTimeField(default=timezone.now)

class SiteArticlesImage(models.Model):
	property = models.ForeignKey(SiteArticles, related_name="images", on_delete= models.CASCADE)
	title = models.CharField(max_length=100)
	caption = models.TextField()
	img = models.ImageField(upload_to='imgs/sitearticlesimgs')
	date = models.DateTimeField(default=timezone.now)