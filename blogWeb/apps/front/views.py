# -*- coding:utf-8-*-
from django.shortcuts import render, render_to_response, redirect
from django.shortcuts import render, redirect,\
                            render_to_response
from django.template import RequestContext

#just a test, index  will change soon
import logging
import os
import time

logger = logging.getLogger('mylog')

def index(request):
    if not request.COOKIES.has_key('sessionid'):
        return redirect("/blogsite/")
    else :
        return redirect("/blogsite/blogs/")

def userEnter(request):
    if not not request.COOKIES.has_key('sessionid'):
        return redirect("/blogsite/blogs/")
    else :
        return render_to_response('main/user_enter.html',
                                context_instance=RequestContext(request))

#把日志系统封装一下，顺便练习下使用类
class LOGG(object):
    def __init__(self):
        self.string = ""

    def logErr(self, str):
        self.string = '['+ time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())) + '] '
        self.string = self.string + '[ERROR] ' + str
        logger.error(self.string)
        return
    def logInfo(self, str):
        self.string = '['+ time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())) + '] '
        self.string = self.string + '[INFOR] ' + str
        logger.info(self.string)
        return
    def logDebug(self, str):
        self.string = '['+ time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())) + '] '
        self.string = self.string + '[DEBUG] ' + str
        logger.debug(self.string)
        return
