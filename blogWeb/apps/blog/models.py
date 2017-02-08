from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User as django_user

class Article(models.Model):
    id = models.AutoField(primary_key=True)
    user =  models.ForeignKey(django_user, blank=True, null=True)
    name = models.CharField( null = False,max_length=100)
    content = models.TextField(blank = True, null = True)
    create_at = models.DateTimeField(_('public time'), auto_now_add=True, editable=True)
    update_at = models.DateTimeField(_('update time'), auto_now=True, null=True)
    level = models.IntegerField(null = False, default = 1)
    category = models.CharField(max_length=20)
    deleted = models.BooleanField( null = False,default = 0)
    description = models.TextField(_("sketch"),  null = False, default = '')
    goodnum = models.IntegerField(null = False, default = 0)
    badnum = models.IntegerField(null = False, default = 0)
    is_public = models.BooleanField( null = False,default = 0)
    type = models.CharField( blank = True, null = True,max_length=50)

    class Meta:
        db_table = "article_info"
        ordering = ['-create_at']
        verbose_name = _("article_info")
        verbose_name_plural= _("article_info")
