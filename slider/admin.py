from django.contrib import admin
from .models import Slider
from django_summernote.admin import SummernoteModelAdmin

# Apply summernote to all textField in model
class SliderAdmin(SummernoteModelAdmin):
	summernote_fields = '__all__'

admin.site.register(Slider, SliderAdmin)
