from django.contrib import admin
from .models import Articles, SiteArticles, SiteArticlesImage 

from django_summernote.admin import SummernoteModelAdmin

# Apply summernote to all textField in model
class ArticlesAdmin(SummernoteModelAdmin):
	summernote_fields = '__all__'

class SiteArticleImageInline(admin.TabularInline):
	model = SiteArticlesImage
	extra = 3

class SiteArticlesImageAdmin(SummernoteModelAdmin):
	summernote_fields = '__all__'

class SiteArticlesAdmin(SummernoteModelAdmin):
	inlines = [ SiteArticleImageInline, ]
	summernote_fields = '__all__'

admin.site.register(Articles, ArticlesAdmin)
admin.site.register(SiteArticles, SiteArticlesAdmin)