#-*-coding:utf-8-*-
"""
Django settings for blogWeb project.

Generated by 'django-admin startproject' using Django 1.8.2.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
from datetime import timedelta

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'e^q8v00f+8o%04ar@cnyjn-7vj9w$zq4%1nlm(_%@mzc-!ppe_'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*",]

# Application definition

INSTALLED_APPS = (
    'bootstrap_admin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'apps',
    'render',
    'apps.blog',
    'apps.users',
    'apps.front',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.locale.LocaleMiddleware',
)

ROOT_URLCONF = 'blogWeb.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.core.context_processors.i18n',
                'django.core.context_processors.static',
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'blogWeb.wsgi.application'

# log system setting

from blogWeb.log_settings import LOGGING

# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': r'',
        'USER': 'root',
        'PASSWORD': '',
        'CHARSET': 'utf8',
        'HOST':'127.0.0.1',
        'PORT':'3306',
         'OPTIONS': {
            'init_command': 'SET storage_engine=INNODB',
        }
    }
}

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticated',),
    'PAGINATE_BY': 10,
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser'
    )
}

#这个是未认证用户默认跳到这个url
LOGIN_URL = '/'


#django upload files

UPLOAD_FILES = (
    "django.core.files.uploadhandler.MemoryFileUploadHandler",
    "django.core.files.uploadhandler.TemporaryFileUploadHandler",
)
FILE_UPLOAD_MAX_MEMORY_SIZE = 0
FILE_UPLOAD_PERMISSIONS = None
FILE_UPLOAD_TEMP_DIR = BASE_DIR + "/apps/upload/"
#FILE_UPLOAD_HANDLERS

# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'zh-hans'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

LOCALE_PATHS = (
    os.path.join(BASE_DIR, 'apps/locale'),
)

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')


#邮件配置
#ACTIVATE_EMAIL_EXPIRE_DAYS = timedelta(30)

EMAIL_HOST = 'smtp.163.com'                    #SMTP地址
EMAIL_PORT = 25                                  #SMTP端口
EMAIL_HOST_USER = ''      #我自己的邮箱
EMAIL_HOST_PASSWORD = ''                  #我的邮箱密码
EMAIL_SUBJECT_PREFIX = u'[BiggerW博客]'        #为邮件Subject-line前缀,默认是'[django]'
EMAIL_USE_TLS = True                             #与SMTP服务器通信时，是否启动TLS链接(安全链接)。默认是false
SERVER_EMAIL = u'[BiggerW博客]'                   #设置发件人

#管理员站点
SERVER_EMAIL = ''        #The email address that error messages come from, such as those sent to ADMINS and MANAGERS.
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER