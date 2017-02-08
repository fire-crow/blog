#-*-coding-utf-8-*-
from rest_framework import serializers

class CommonSerializer(serializers.HyperlinkedModelSerializer):
    delete_date =  serializers.DateTimeField(format="%Y-%m-%d %H:%M",
                                             required=False, allow_null=True)
    last_login = serializers.DateTimeField(format="%Y-%m-%d %H:%M",
                                            required=False, allow_null=True)
    date_joined = serializers.DateTimeField(format="%Y-%m-%d %H:%M",
                                            required=False, allow_null=True)
    groups = serializers.DjangoModelField()
    user_permissions = serializers.DjangoModelField()