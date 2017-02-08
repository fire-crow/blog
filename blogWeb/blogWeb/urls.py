"""blogWeb URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import *
from django.contrib import admin
from apps.blog import views as blog_view
from apps.users import views as users_view
from apps.front import views as front_view
from django.views.generic import RedirectView
import settings

urlpatterns = patterns(
    '',
	url(r'^favicon\.ico$', RedirectView.as_view(url=settings.STATIC_URL + 'plugins/img/favicon.ico')),
    url(r'^$', front_view.index, name="index"),
    url(r'^blogsite/$', blog_view.blog, name="blog"),
    url(r'^blogsite/blogs/$', blog_view.allBlogs, name="allBlogs"),
    url(r'^blogsite/blogs/write/$', blog_view.write_blog, name="write_blog"),
    url(r'^blogsite/blogs/view/(.+)/$', blog_view.view_blog, name="view_blog"),
    url(r'^blogsite/login/$', front_view.userEnter, name="userEnter"),
    url(r'^blogsite/register/$', front_view.userEnter, name="userEnter"),
    url(r'^blogsite/forget/$', front_view.userEnter, name="userEnter"),
    url(r'^blogsite/email_validate/$', front_view.userEnter, name="userEnter"),
    url(r'^blogsite/mine/setting/$', users_view.user_setting, name="user_setting"),
    url(r'^blogsite/mine/blogs/$', blog_view.my_blogs, name="my_blogs"),
    url(r'^user/check_email/confirm/', users_view.activeUser, name="activeUser"),
    url(r'^api/', include('apps.urls')),
    url(r'^admin/', include(admin.site.urls)),
)


