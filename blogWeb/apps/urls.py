from django.conf.urls import patterns, include, url
from rest_framework.urlpatterns import format_suffix_patterns
from blog import views as blog_view
from users import views as users_view

#init
urlpatterns = [
]

#users
urlpatterns += [
    url(r'^user/login/$', users_view.userLogin),
	url(r'^user/register/$', users_view.newUserRegister),
    url(r'^user/logout/$', users_view.userLogout),
    url(r'^user/check_email/$', users_view.check_email),
    url(r'^user/checkNameEmail/$', users_view.check_name_email),
    url(r'^user/sendCheckNum/$', users_view.send_checkNum),
    url(r'^user/check_num_is_right/$', users_view.check_checkNum),
    url(r'^user/change_password_by_email/$', users_view.change_password_by_email),
    url(r'^user/info/$', users_view.UserInfoList.as_view()),
    url(r'^user/upload/', users_view.upload_file),
    url(r'^user/setted/', users_view.userinfo_setted),
]

#blog
urlpatterns += [
    url(r'^readyto/blogs/All/$', blog_view.blog_main, name="blog_main"),
    url(r'^blogs/all/$', blog_view.BlogList.as_view()),
    url(r'^blogs/all/(.+)/$', blog_view.BlogList.as_view()),
    url(r'^blogs/saveBlog/$', blog_view.saveBlog),
]
