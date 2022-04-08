from django.db import models

class Csv(models.Model):
	title = models.CharField(max_length=100)
	csv = models.FileField(upload_to='query/csvs/', max_length=100)

	def __str__(self):
		return self.title

	def delete(self, *args, **kwargs):
		self.csv.delete()
		super().delete(*args, **kwargs)
