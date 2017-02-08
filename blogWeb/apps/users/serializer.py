#-*-coding:utf8-*-
from django.contrib.auth.models import User
from apps.users.models import UploadImage
from apps.front.serializer import CommonSerializer
from rest_framework import serializers

class UserSerializer(CommonSerializer):
    sweet_name = serializers.ReadOnlyField()
    first_name = serializers.ReadOnlyField()
    sex = serializers.ReadOnlyField()
    mobile_phone = serializers.ReadOnlyField()
    email = serializers.ReadOnlyField()
    article_num = serializers.ReadOnlyField()
    level = serializers.ReadOnlyField()
    headshot = serializers.ReadOnlyField()
    tips = serializers.ReadOnlyField()
    signature = serializers.ReadOnlyField()
    user_permissions = serializers.ReadOnlyField()
    url = serializers.ReadOnlyField()
    groups = serializers.ReadOnlyField()
    fans_num = serializers.ReadOnlyField()
    focus_num = serializers.ReadOnlyField()
    publuc_num = serializers.ReadOnlyField()
    birthday = serializers.DateTimeField(format="%Y-%m-%d",
                                         required=False, allow_null=True)
    company = serializers.ReadOnlyField()
    job_type = serializers.ReadOnlyField()
    local = serializers.ReadOnlyField()
    label = serializers.ReadOnlyField()
    qq = serializers.ReadOnlyField()
    wechat = serializers.ReadOnlyField()
    user = serializers.ReadOnlyField()
    class Meta:
        model = User

class UploadImageSerializer(CommonSerializer):
    class Meta:
        model = UploadImage