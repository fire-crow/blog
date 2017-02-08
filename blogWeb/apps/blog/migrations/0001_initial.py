# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('content', models.TextField(null=True, blank=True)),
                ('create_at', models.DateTimeField(auto_now_add=True, verbose_name='public time')),
                ('update_at', models.DateTimeField(auto_now=True, verbose_name='update time', null=True)),
                ('level', models.IntegerField(default=1)),
                ('category', models.CharField(max_length=20)),
                ('deleted', models.BooleanField(default=0)),
                ('description', models.TextField(default=b'', verbose_name='sketch')),
                ('goodnum', models.IntegerField(default=0)),
                ('badnum', models.IntegerField(default=0)),
                ('is_public', models.BooleanField(default=0)),
                ('user', models.ForeignKey(blank=True, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'ordering': ['-create_at'],
                'db_table': 'article_info',
                'verbose_name': 'article_info',
                'verbose_name_plural': 'article_info',
            },
        ),
    ]
