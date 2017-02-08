#-*-coding:utf8-*-
from django.shortcuts import render, redirect,\
                            render_to_response
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User

from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.decorators import api_view

from apps.blog.models import Article


from apps.front.views import LOGG
from apps.blog.serializer import BlogSerializer

#just a test, index  will change soon
import time
import json
import re

LOG= LOGG()

def blog(request):
    LOG.logInfo("entered blog page")
    if not request.COOKIES.has_key('sessionid'):
        return render_to_response('main/overview.html',
                                context_instance=RequestContext(request))
    else :
        return redirect("blogs/")


def addNewArticle(request):
    pass


def blog_main(request):
    if request.POST['username']:
        LOG.logInfo(request.POST['username'] + " entered blog main page")
        redirect("/blogs/all")
        result = json.dumps( { 'success': True, "MSG":  {'username': request.POST['username']}}, cls = DjangoJSONEncoder )
        return HttpResponse(result)
    else:
        LOG.logInfo("A visitor wants to view our blogs, and wo push him out.")
    return

@login_required
def allBlogs(request):
    return render_to_response('main/blog_all.html',
                                context_instance=RequestContext(request))


@login_required
def my_blogs(request):
    return render_to_response('main/blog_mine.html',
                                context_instance=RequestContext(request))

class blogInfo(object):
    pk = 0
    pass

class BlogList(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = BlogSerializer
    def list(self, request, *args, **kwargs):
        blog_id = request.GET.get('id', '')
        if not blog_id:
            queryset = self.get_queryset().filter(is_public=True)
        else:
            queryset = self.get_queryset().filter(pk= request.GET['id'], is_public=True)
        request_user_id = request.user.id
        objlist=[]
        for item in queryset:
            obj = blogInfo()
            obj = item
            user = User.objects.get(id=item.user_id)
            obj.sweet_name = user.sweet_name
            obj.headshot = user.headshot
            if request_user_id == item.user_id:
                obj.is_own_blog = True
            else:
                obj.is_own_blog = True
            objlist.append(obj)
        serializer = BlogSerializer(objlist, many=True)
        if not blog_id:
            return Response(serializer.data)
        else:
            return Response(serializer.data[0])

@api_view(['GET'])
def write_blog(request):
    return render_to_response('main/blog_write.html',
                                context_instance=RequestContext(request))
#将常用中文标点转换为英文标点
def signal_zh_transto_en(data):
    #import pdb;pdb.set_trace()
    data = data.replace('，', ', ')
    data = data.replace('。', '```')
    data = data.replace('！', '! ')
    data = data.replace('：', ': ')
    data = data.replace('；', '; ')
    data = data.replace('——', ' -- ')
    data = data.replace('……', '......')
    data = data.replace('）', ') ')
    data = data.replace('（', ' (')
    data = data.replace('【', ' [')
    data = data.replace('】', '] ')
    data = data.replace('？', '? ')
    data = data.replace('、', ',,')
    data = data.replace('“', ' "')
    data = data.replace('”', '" ')
    data = data.replace('’', '\' ')
    data = data.replace("‘", ' \'')
    data = data.replace("《", '<<')
    data = data.replace("》", '>>')
    data = data.replace("·", '++')
    return data

#将常用英文标点转换为中文标点
def signal_en_transto_zh(data):
    data = data.replace('```', '。')
    data = data.replace('......', '……')
    data = data.replace(',,', '、')
    data = data.replace("<<", '《')
    data = data.replace('>>', '》')
    data = data.replace("++", '·')
    data = data.replace("\~\!\@\#", ' ')
    return data


def deal_description(data):
    # 将 文本从utf-8 解码成 str 格式
    data = data.encode("utf-8")
    data = signal_zh_transto_en(data)
    gps = data.split('~!@#')
    str = ""
    reg = r' *(\<|\>|\,|\.|\?|\/|\\|\'|\"|\:|\;|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\+|\-|\=|\[|\}|\{|\]) *'
    for line in gps:
        #import pdb;pdb.set_trace()
        result = re.match(reg, line)
        if not result:
            line = line + ', '
        str +=line
    data = signal_en_transto_zh(str)
    # 将 文本从 str 编码成 utf-8 格式
    data = unicode(data, "utf-8")
    if len(data) > 512:
        data = data[0:512] + "..."
    else:
        data = data[0:512]
    return data


@api_view(['POST'])
def saveBlog(request):
    data = request.POST
    username= request.user.username
    now = int(time.time())
    timeArray = time.localtime(now)
    create_at = time.strftime("%Y-%m-%d %H:%M:%S", timeArray)
    user_id = User.objects.get(username=username).id
    description = request.POST.get('description', '')
    if not not description:
        description = deal_description(description)
    if "true" == data["is_public"]:
        is_public = True
    else :
        is_public = False
    try:

        Article(
            name=data['name'],
            content=data['content'],
            create_at=create_at,
            update_at = create_at,
            category=data['category'],
            description =description,
            user_id =user_id,
            is_public = is_public,
        ).save()
        LOG.logInfo("%s save a blog successful!" % username)
    except Exception as err:
        LOG.logErr(username + " save blog failed!", "because of : "+ str(err))
        return Response({'success': False,
                        "MSG":err }, status=status.HTTP_400_BAD_REQUEST)
    return Response({'success': True,
                      "MSG":_('save blog success')}, status=status.HTTP_201_CREATED)


@login_required
def view_blog(request, blog_id):
    return render_to_response('main/blog_view.html',{'blog_id': blog_id},
                                context_instance=RequestContext(request))