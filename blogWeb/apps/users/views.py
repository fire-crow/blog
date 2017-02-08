# -*- coding:utf-8-*-
from django.shortcuts import render, redirect, \
                            render_to_response
from django.template import RequestContext
from django.contrib import auth
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse
from django.utils.translation import ugettext_lazy as _
from django.core.serializers.json import DjangoJSONEncoder
from django.core.mail import EmailMessage

from apps.users.models import UploadImage
from apps.users.models import CheckNumber
from apps.front.views import LOGG
from apps.users.serializer import (UserSerializer, UploadImageSerializer)

from rest_framework.test import APIRequestFactory
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view

from blogWeb.settings import BASE_DIR
import os, base64
import time
import json
import random

LOG= LOGG()

def newUserRegister(request):
    #import pdb; pdb.set_trace()
    try:
        data = request.POST
        mk_pwd = make_password(data['password'], None, 'pbkdf2_sha256')
        django_new_user = User(username=data['username'], password = mk_pwd, tips=data['tips'],
                               sweet_name = data['sweet_name'], is_active=False)
        django_new_user.save()
        checkNumObj = CheckNumber(user_id=django_new_user.id, random_num=str(0), create_at=str(0))
        checkNumObj.save()
        makedir_of_userself(data['username'])
    except Exception as err:
        LOG.logErr("register err " + str(err))
        result = json.dumps( { 'success': False, "MSG":  {'data': str(err)}}, cls = DjangoJSONEncoder )
        return HttpResponse(result)
    LOG.logInfo(data['sweet_name'] + " register success!")
    user = auth.authenticate(username=data['username'], password=data['password'])
    if user is not None :
        result = json.dumps( { 'success': True,
                               "MSG":  {'usd': b64encode(data['username']),
                                         'usp':b64encode(data['password'])}},
                             cls = DjangoJSONEncoder )
        return HttpResponse(result)

# 用于将用户名加密
def b64encode(value):
    value = base64.b64encode(value)
    value = base64.b64encode(value)
    value = base64.b64encode(value)
    return value

# 用于将用户名解密
def b64decode(value):
    value = base64.b64decode(value)
    value = base64.b64decode(value)
    value = base64.b64decode(value)
    return value

def send_email(subject, text_content, to):
    try:
        emailObj = EmailMessage(subject, text_content, to=[to], headers = {'Reply-To': 'BiggerW_blog@163.com'})
        emailObj.send()
    except:
        result = json.dumps( { 'success': False, "MSG":  {'data': "email sended fail"}}, cls = DjangoJSONEncoder )
        return HttpResponse(result)
    return



def check_email(request):
    username = request.POST.get("username", "")
    email = request.POST.get("email", "")
    password = request.POST.get("password", "")

    subject,to = u'biggerW博客请求确认您的电子邮件。', email

    urlPath = 'http://' + request.get_host() + request.path[4:] + 'confirm?usd='\
               + b64encode(username) + '&usp='+ b64encode(password) + '&ust=' \
               + b64encode(str(time.time()))
    text_content = \
        u'''

        欢迎来到biggerW博客，请确认您的邮件!
        请点击以下链接确认你的邮件，您的邮件将成为您在「biggerW博客」最重要的身份认证。
        或者您可以将如下链接粘帖至您浏览器的地址栏并敲击回车:
        ''' + urlPath

    try:
        send_email(subject, text_content, to)
        user = User.objects.get(username=username)
        user.email = email
        user.save()
        result = json.dumps( { 'success': True, "MSG":  {'data': "email sended success"}}, cls = DjangoJSONEncoder )
        return HttpResponse(result)
    except Exception as err:
        result = json.dumps( { 'success': False, "MSG":  {'data': "email sended fail"}}, cls = DjangoJSONEncoder )
        return HttpResponse(result)

def userLogin(request):
    try:
        sweet_name = request.POST.get("sweet_name","")
        password = request.POST.get("password","")
        username = User.objects.get(sweet_name=sweet_name).username
        if sweet_name and password:
            user = auth.authenticate(username=username, password=password)
            if user is not None and user.is_active:
                auth.login(request, user)
            else:
                LOG.logErr("login err : " + "username or password is wrong")
                result = json.dumps( { 'success': False, "MSG":  {'data': "username or password is wrong"}}, cls = DjangoJSONEncoder )
                return HttpResponse(result)
        else :
            LOG.logErr("login err : " + "sweet_name and password can not be empty")
            result = json.dumps({'success': False, "MSG": {'data': "sweet_name and password can not be empty"}},
                                cls=DjangoJSONEncoder)
            return HttpResponse(result)

    except Exception as err:
        LOG.logErr("login err : " + str(err))
        result = json.dumps( { 'success': False, "MSG":  {'data': str(err)}}, cls = DjangoJSONEncoder )
        return HttpResponse(result)
    LOG.logInfo(sweet_name + " login success!")
    result = json.dumps( { 'success': True, "MSG":  {'username': b64encode(sweet_name)}}, cls = DjangoJSONEncoder )
    return HttpResponse(result)

def userLogout(request):
    data = request.POST
    try:
        auth.logout(request)
        LOG.logInfo(data['sweet_name'] + " logout success!")
        result = json.dumps( { 'success': True, "MSG": "logout success"} , cls = DjangoJSONEncoder )
    except Exception as err:
        LOG.logErr(data['sweet_name'] + " logout failed!", "because of : "+ str(err))
        result = json.dumps( { 'success': False, "MSG":  "logout failed!!"}, cls = DjangoJSONEncoder )
    return HttpResponse(result)

def makedir_of_userself(userdirname):
    file_nanm = ""
    try:
        path = BASE_DIR + "/render/static/upload/img/" + userdirname
        if not os.path.exists(path):
            os.makedirs(path)
        else:
            LOG.logDebug("dir name of " + userdirname + "is exists!")
    except Exception as err:
        LOG.logErr("create dir err : " + str(err))
    return

#from somewhere import handle_uploader_file
def handle_uploaded_file(str, filename, username):
    file_name = ""
    try:
        path = BASE_DIR + "/render/static/upload/img/" + username + "/"
        if not os.path.exists(path):
            os.makedirs(path)
        file_name = path + filename
        destination = open(file_name, 'wb+')
        destination.write(str)
        file_name = "/static/upload/img/" + username + "/" + filename
    except Exception, err:
        LOG.logErr("upload file err : " + str(err))
        return Response({'success': False,"MSG":str(err)}, status=status.HTTP_400_BAD_REQUEST)
    return file_name

@api_view(['POST'])
def upload_file(request):
    path = ""
    try:
        user = User.objects.get(pk=request.user.id)
        if request.POST['file']:
            strs = request.POST['file']
            str = strs.split(',', 1)
            imgdata=base64.b64decode(str[1])
            path = handle_uploaded_file(imgdata, request.POST['filename'], user.username)
        image = UploadImage()
        image.title = request.POST['filename']
        image.filepath = path
        image.save()
        user.headshot = path
        user.save()

    except Exception as err:
        LOG.logErr("upload err : " + str(err))
        return Response({'success': False,"MSG":err }, status=status.HTTP_400_BAD_REQUEST)
    LOG.logInfo("upload success!")
    return Response({'success': True,
                      "MSG":_('upload image success')}, status=status.HTTP_201_CREATED)

#通过邮件激活用户
def activeUser(request):
    try:
        import pdb;pdb.set_trace()
        username = request.GET['usd']
        password = request.GET['usp']
        that_time = request.GET['ust']
        current_time = time.time()
        that_time= float(b64decode(that_time))
        if current_time-that_time > 3600:
            return render_to_response('common/error.html', {'error': u"链接超时，请重新注册"})
        username= b64decode(username)
        password= b64decode(password)
        newuser = User.objects.get(username=username)
        newuser.is_active = True
        newuser.save()
        user = auth.authenticate(username=newuser.username, password=password)
        if user is not None and user.is_active:
            auth.login(request, user)
            LOG.logInfo(username + " active success!")
            return render_to_response('common/success.html', {'success': u"邮箱验证成功",
                                                                  "UOS": b64encode(user.sweet_name)})
        else:
            return render_to_response('common/error.html', {'error': u"邮箱验证失败"})
    except Exception as err:
        LOG.logErr("activeUser err " + str(err))
        return render_to_response('common/error.html', {'error': u"邮箱验证失败"})


def check_name_email(request):
    sweet_name = request.POST.get("sweet_name", "")
    email = request.POST.get("email", "")
    #判断是否两个变量都有值
    #import pdb; pdb.set_trace()
    if not sweet_name or not email:
        result = json.dumps({'success': False, "MSG":{"data" : 'name and email is required'}}, cls = DjangoJSONEncoder)
        return HttpResponse(result)
    user = User.objects.get(sweet_name=sweet_name)
    #判断是否有当前用户
    if not user:
        result = json.dumps({'success': False, "MSG":{"data": 'this user is not exist'}}, cls = DjangoJSONEncoder)
        return HttpResponse(result)
    #判断用户和邮箱是否匹配
    if email != user.email:
        result = json.dumps({'success': False, "MSG":{"data" : 'user and email is mismatching'}}, cls = DjangoJSONEncoder)
        return HttpResponse(result)

    result = json.dumps({'success': True, "MSG":{"data": 'username and email is match, success'}}, cls = DjangoJSONEncoder)
    return HttpResponse(result)

#获取验证码
def get_checkNum(send_url_time):
    this_time = time.time()
    checkNum = CheckNumber.objects.get(create_at=send_url_time)
    mystr = ""
    list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    slice = random.sample(list, 6)
    for i in slice:
        mystr += str(i)
    #如果第一次找回密码
    if not checkNum.random_num or not float(checkNum.create_at):
        checkNum.create_at = str(this_time)
        checkNum.random_num = mystr
        checkNum.save()
        return mystr
    else:
        #验证码有效时间一小时
        if this_time > float(send_url_time) + 3600:
            checkNum.create_at = str(this_time)
            checkNum.random_num = mystr
            checkNum.save()
            return mystr
        else:
            return checkNum.random_num

def send_checkNum(request):
    sweet_name = request.POST.get("sweet_name", "")
    email = request.POST.get("email", "")

    user_id = User.objects.get(sweet_name=sweet_name).id
    send_url_time = CheckNumber.objects.get(user_id=user_id).create_at
    #从数据库获取验证码
    mystr = get_checkNum(send_url_time)

    subject,to = u'biggerW博客--登录保护验证', email

    text_content = \
        u'''

        亲爱的用户：
        您好！感谢您使用biggerW博客，您正在进行邮箱验证，本次请求的验证码为：
         %s  (为了保障您帐号的安全性，请在1小时内完成验证。)

        biggerW博客

        ''' % mystr
    try:
        send_email(subject, text_content, email)
    except Exception as err:
        LOG.logErr("send email of check number err because:" + str(err))
        result = json.dumps({'success': False, "MSG":{"data" : 'email send fail!'}}, cls = DjangoJSONEncoder)
        return HttpResponse(result)

    LOG.logInfo("send check number success!")
    result = json.dumps({'success': True, "MSG": {"data": 'send check number success!'}}, cls=DjangoJSONEncoder)
    return HttpResponse(result)


#检查验证码是否正确
def check_checkNum(request):
    sweet_name = request.POST.get("sweet_name", "")
    email = request.POST.get("email", "")
    random_num = request.POST.get("random_num", "")
    if not random_num or not sweet_name:
        result = json.dumps({'success': False, "MSG": {"data": 'random_num and sweet_name can not be empty'}}, cls=DjangoJSONEncoder)
        return HttpResponse(result)
    user_id = User.objects.get(sweet_name=sweet_name).id
    table_num = CheckNumber.objects.get(user_id=user_id).random_num
    if str(random_num) == str(table_num):
        result = json.dumps({'success': True, "MSG": {"data": 'check number success!'}}, cls=DjangoJSONEncoder)
        return HttpResponse(result)
    else:
        result = json.dumps({'success': False, "MSG": {"data": 'num is not match'}}, cls=DjangoJSONEncoder)
        return HttpResponse(result)


def change_password_by_email(request):
    sweet_name = request.POST.get("sweet_name", "")
    email = request.POST.get("email", "")
    password = request.POST.get("password", "")
    if sweet_name and password:
        mk_pwd = make_password(password, None, 'pbkdf2_sha256')
        user = User.objects.get(sweet_name=sweet_name)
        user.password = mk_pwd
        user.save()
        result = json.dumps({'success': True, "MSG": {"data": 'change password success!'}}, cls=DjangoJSONEncoder)
        return HttpResponse(result)
    else:
        result = json.dumps({'success': False, "MSG": {"data": 'password and sweet_name can not be empty'}}, cls=DjangoJSONEncoder)
        return HttpResponse(result)


@login_required
def user_setting(request):
    return render_to_response('main/user_setting.html',
                                  context_instance=RequestContext(request))

class myInfo(object):
    def __init__(self):
        password= "xxxxxx"
        username = "xxxxxx"


class UserInfoList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def _get_user_info(self, obj):
        user = myInfo()
        user.sweet_name = obj.sweet_name
        user.sex= obj.sex
        user.mobile_phone= obj.mobile_phone
        user.email= obj.email
        user.article_num= obj.article_num
        user.level= obj.level
        user.headshot= obj.headshot
        user.tips= obj.tips
        user.last_login= obj.last_login
        user.date_joined= obj.date_joined
        user.signature=obj.signature
        user.fans_num =obj.fans_num
        user.focus_num = obj.focus_num
        user.publuc_num = obj.publuc_num
        user.birthday =obj.birthday
        user.company =obj.company
        user.job_type =obj.job_type
        user.local =obj.local
        user.label = obj.label
        user.first_name = obj.first_name
        user.qq = obj.qq
        user.wechat = obj.wechat
        user.password= "xxxxxx"
        user.username = "xxxxxx"
        return user

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        queryset = queryset.filter(id=request.user.id)
        queryset = [self._get_user_info(queryset[0])]

        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)



@api_view(['POST'])
def userinfo_setted(request):
    user_id = request.user.id
    user = User.objects.get(pk=user_id)
    if not user:
        LOG.logErr("user can not found when user setting changed and be saving " )
        return Response({'success': False, "MSG": _("can not find user when saving user info")}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user.sex = int(request.POST.get("sex", 0))
        user.signature = request.POST.get("signature", "")

        user.birthday = request.POST.get("birthday", "")
        user.company = request.POST.get("company", "")
        user.job_type = request.POST.get("job_type", "")
        user.local = request.POST.get("local", "")
        user.label = request.POST.get("label", "")
        user.first_name = request.POST.get("first_name", "")
        user.qq = request.POST.get("qq", "")
        user.wechat = request.POST.get("wechat", "")
        user.save()
    except Exception as err:
        LOG.logErr("save user info err!" )
        return Response({'success': False, "MSG": _("a err happened when saving user info")}, status=status.HTTP_400_BAD_REQUEST)
    LOG.logInfo("save user info success!")
    return Response({'success': True, "MSG": _(" saving user info success")}, status=status.HTTP_201_CREATED)