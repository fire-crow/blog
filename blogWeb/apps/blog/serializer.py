# -*- coding: utf-8 -*-
from rest_framework import serializers
from apps.blog.models import Article

class BlogSerializer(serializers.ModelSerializer):

    create_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M",
                                            required=False, allow_null=True)
    update_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M",
                                            required=False, allow_null=True)
    name = serializers.ReadOnlyField()
    level = serializers.ReadOnlyField()
    category = serializers.ReadOnlyField()
    description = serializers.ReadOnlyField()
    goodnum = serializers.ReadOnlyField()
    badnum = serializers.ReadOnlyField()
    sweet_name = serializers.ReadOnlyField()
    headshot = serializers.ReadOnlyField()
    type = serializers.ReadOnlyField()
    id = serializers.ReadOnlyField()
    is_own_blog = serializers.BooleanField()

    class Meta:
        model = Article


