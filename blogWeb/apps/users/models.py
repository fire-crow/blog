#-*-coding:utf-8-*-
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from django import forms


#对于传统类，他们的元类都是types.ClassType
class ProfileBase(type):
    def __new__(cls,name,bases,attrs): #带参数的构造器，__new__一般用于设置不变数据类型的子类
         module = attrs.pop('__module__')
         parents = [b for b in bases if isinstance(b, ProfileBase)]
         if parents:
             fields = []
             for obj_name, obj in attrs.items():
                if isinstance(obj, models.Field):
                 fields.append(obj_name)
                 User.add_to_class(obj_name, obj)
             UserAdmin.fieldsets = list(UserAdmin.fieldsets)
             UserAdmin.fieldsets.append((name, {'fields': fields}))
         return super(ProfileBase, cls).__new__(cls, name, bases, attrs)

class ProfileUser(object):
    __metaclass__ = ProfileBase #类属性 class MyProfile(ProfileUser):


class UserProfile(ProfileUser):
    sweet_name = models.CharField(max_length=32, null=True)
    #age = models.PositiveIntegerField(blank=True,null =True)
    sex = models.IntegerField(blank=True,default = 0 )
    deleted = models.BooleanField(default = 0)
    mobile_phone = models.IntegerField(blank=True,null =True)
    delete_date =  models.DateTimeField(_('delete date'), editable=True, null =True)
    article_num = models.IntegerField(default = 0)
    fans_num = models.IntegerField(default=0)
    focus_num = models.IntegerField(default=0)
    publuc_num = models.IntegerField(default=0)
    birthday = models.DateTimeField(_('birthday'), blank=True, editable=True, null =True)
    company = models.CharField(max_length=100, null=True, blank=True)
    job_type = models.CharField(max_length=100, null=True, blank=True)
    local = models.CharField(max_length=100, null=True, blank=True)
    label = models.CharField(max_length=100, null=True, blank=True)
    level = models.IntegerField(default = 1, null=True)
    headshot = models.TextField(null = True, default="/static/upload/img/default.png")
    tips = models.CharField(max_length=100, null=True, blank=True)
    signature = models.CharField(max_length=100, null=True)
    qq = models.CharField(max_length=30, null=True, blank=True)
    wechat = models.CharField(max_length=30, null=True, blank=True)


class UploadImage(models.Model):
    id = models.AutoField(primary_key=True)
    user =  models.ForeignKey(User, blank=True, null=True)
    title = models.CharField(max_length=32)
    filepath = models.CharField(max_length=255)
    class Meta:
        db_table = "image_upload"


class CheckNumber(models.Model):
    id = models.AutoField(primary_key=True)
    user =  models.ForeignKey(User, blank=True, null=True)
    random_num = models.CharField(null = False, max_length=10)
    create_at = models.CharField(max_length=32, null = False)

    class Meta:
        db_table = "check_number"
        ordering = ['-id']