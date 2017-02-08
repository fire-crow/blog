/**
 * Created by biggerW
 * Author: 572216278@qq.com
 * Date: 2016-06-23
 */
'use strict';
var BlogApp = angular.module("BlogApp", [
    'pascalprecht.translate',
    'ngAnimate',
    'ngCookies',
    'ngDialog',
    'ngResource',
    'meta.umeditor',
    "blog.filters",
    "blog.factorys",
    'blog.directives',
    'blog.services'
]);
//angularjs i18n
BlogApp.config(['$translateProvider', function ($translateProvider) {
    var lang = window.localStorage.lang || 'cn';
    $translateProvider.preferredLanguage(lang);
    $translateProvider.useStaticFilesLoader({
        prefix: '/static/plugins/i18n/',
        suffix: '.json'
    });
}]);
//锚点
BlogApp.config(function ($anchorScrollProvider) {
    $anchorScrollProvider.disableAutoScrolling();
});
BlogApp.config(["$resourceProvider",function($resourceProvider){
    $resourceProvider.defaults.stripTrailingSlashes = false;
}])
BlogApp.run(['$anchorScroll', function ($anchorScroll) {
    $anchorScroll.yOffset = 50;
    // 默认向下便宜50px
    // 在此处配置偏移量
}])
// popup plugins init
BlogApp.config(function (ngDialogProvider) {
    ngDialogProvider.setOpenOnePerName(true);
});
//edit a way which can express this is angular variable
BlogApp.config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol("{[{");
    $interpolateProvider.endSymbol("}]}");
}]);
//csrf problem can be resolved by this config
BlogApp.config(['$httpProvider', function ($httpProvider, $cookies, $cookieStore) {
    $httpProvider.defaults.withCredentials = true;
    //$httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Request-Width'];
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.cache = false;
}]);
/* Setup App Main Controller */
BlogApp.controller('AppController', ['$scope', '$rootScope', '$interval',
    '$anchorScroll', '$location', 'Trans', '$window','ngDialog','$http','$cookieStore',
    function ($scope, $rootScope, $anchorScroll, $location, $interval, Trans, $window, ngDialog, $http, $cookieStore) {
        //$cookieStore.put("AngularJs", "xcccc");
        $scope.windowSession = $window.sessionStorage
        $scope.$on("shouldReload", function (event, msg) {
            $scope.$broadcast("PageWillReload", msg);
        })
        $rootScope.$on('ngDialog.opened', function (e, $dialog) {
            console.log('ngDialog opened: ' + $dialog.attr('id'));
        });
        $(document).ready(function(){
            startOnePage({
                frame: "#view",
                container: "#frame",
                sections: ".op-section",
                radio: "#radio",
                radioOn: "#radioOn",
                speed: 500,
                easing: "swing"
            });
        });
    }]);
BlogApp.controller('OverviewController', function($rootScope, $scope, ngDialog, $http, CommonHttpService, $window,
             $location,$interval) {
})
BlogApp.controller('UserEnterController', function($rootScope, $scope, ngDialog, $http, CommonHttpService, $window,
                                                                  $location,$interval) {
})
BlogApp.controller('BlogWriteController',
    function($rootScope, $scope, ngDialog, $http, $window, $location, $interval,
                CommonHttpService, CommonAlert, Trans) {

    $scope.parseDom = function(arg) {
　　    var objE = document.createElement("div");
　　    objE.innerHTML = arg;
　　    return objE.childNodes;
    };

    $scope.blog = {
        "headline": "",
        "text":""
    };
    var text=""
    $scope.saveBlog = function(blog, is_public) {
        var postdata = {
            "name" : blog.headline,
            "content" : blog.text,
            "category": "其他",
            "is_public": is_public,
        }
        var htmltxt =  $scope.parseDom(blog.text)
        for(var i=0; i< htmltxt.length; ++i) {
            text +=  htmltxt[i].textContent.replace(/(&nbsp; |\s+)/g, '') + '~!@#'
        }
        postdata.description = text
        CommonHttpService.post("/api/blogs/saveBlog/", postdata).then(function(data) {
            if (data.success) {
                var title = Trans.Trans("status.success")
                var content = is_public ? Trans.Trans("write.public") : Trans.Trans("write.save")
                CommonAlert.successTimer(title, content)
            } else {
                var title = Trans.Trans("status.error")
                var content = is_public ? Trans.Trans("write.pub_err") : Trans.Trans("write.save_err")
                CommonAlert.errorTimer(title, content)
            }
        })
    }
});
BlogApp.controller('BlogAllController', function($rootScope, $scope, ngDialog, $http, CommonHttpService, $window,
                                                      $location,$interval, AllBlogs) {
    $scope.$on('$includeContentLoaded', function () {
    });
    //用于 将字符串格式的dom 例如： "<p>我是字符串格式的dom</p>"， 转化为dom 对象
    $scope.parseDom = function(arg) {
　　    var objE = document.createElement("div");
　　    objE.innerHTML = arg;
　　    return objE.childNodes;
    };
    var blogPage = ""
    var blogtitle = "<strong class='row'>"
    AllBlogs.query(function (data) {
        $scope.blogs = data

        /*
        var htmltxt =  $scope.parseDom($scope.blogs.content)
        if (!!htmltxt) {
            var text = ""
            for(var i=0; i< htmltxt.length; ++i) {
                text +=  htmltxt[i].textContent.replace(/\s+/g, '')
            }
        }
        $scope.blogs.text = text

        angular.forEach(data, function (item, index, array) {
            blogPage += "<strong class='row'>" + item.name + "</strong>" + "<small class='content'>" +
                "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + item.content + "</small>"
        });
        var myPageContent = $scope.parseDom(blogPage)
        angular.element("#allblogs").append(myPageContent)
        */



    });
});

BlogApp.controller('BlogViewController', function($rootScope, $scope,  ViewBlog) {

    $scope.blog = {}
    var blogPage = ""

    $scope.parseDom = function(arg) {
　　    var objE = document.createElement("div");
　　    objE.innerHTML = arg;
　　    return objE.childNodes;
    };

    $scope.$on('$includeContentLoaded', function () {
        var blog_id = angular.element("#blog_id").val()
        ViewBlog.get({ id : blog_id}, function (data) {
            $scope.blog=data
            blogPage = "<p class='content'>" + $scope.blog.content + "</p>"
            var myPageContent = $scope.parseDom(blogPage)
            angular.element("#biger_view_blog").append(myPageContent)

        })
    });

})


BlogApp.controller('BlogMineController', function($rootScope, $scope, ngDialog, $http, CommonHttpService, $window,
             $location,$interval) {
})


BlogApp.controller('HeaderController', ['$rootScope', '$scope', '$http', '$interval',
    '$location', '$anchorScroll', '$window', 'CommonHttpService','ngDialog',
        function ($rootScope, $scope, $http, $interval, $location, $anchorScroll, $window, CommonHttpService, ngDialog) {
            var pathname = window.location.pathname
            var windowSession = window.localStorage
            $scope.is_overview = false
            $scope.is_forget = false
            $scope.is_validate = false
            $scope.is_inBlog = false
            var MAPS = {
                "overview":"/blogsite/",
                "login":"/blogsite/login/",
                "register":"/blogsite/register/",
                "forget" : "/blogsite/forget/",
                "email_validate":"/blogsite/email_validate/",
            };
            $scope.userLogin = function () {
                ngDialog.open({
                    template: 'login.html',
                    controller: 'LoginCtrl',
                    className: 'ngdialog-theme-default'
                });
            };
            $scope.userRegister = function () {
                ngDialog.open({
                    template: 'register.html',
                    controller: 'RegisterCtrl',
                    className: 'ngdialog-theme-default'
                });
            };
            $scope.forgetPwd = function () {
                ngDialog.open({
                    template: 'forgetPwd.html',
                    controller: 'ForgetPwdCtrl',
                    className: 'ngdialog-theme-default'
                });
            };
            $scope.email_validate = function () {
                ngDialog.open({
                    template: 'email_validate.html',
                    controller: 'EmailValidateCtrl',
                    className: 'ngdialog-theme-default'
                });
            }
            //根据url决定用那种 导航栏
            $scope.$on('$includeContentLoaded', function(){
                if (MAPS["overview"]== pathname) {
                    $scope.is_overview = true
                    $scope.is_forget = false
                    $scope.is_validate = false
                    $scope.is_inBlog = false
                }else if (MAPS["login"]== pathname) {
                    $scope.is_overview = true
                    $scope.is_forget = false
                    $scope.is_validate = false
                    $scope.is_inBlog = false
                    $scope.userLogin()
                } else if (MAPS["register"]== pathname) {
                    $scope.is_overview = true
                    $scope.is_forget = false
                    $scope.is_validate = false
                    $scope.is_inBlog = false
                    $scope.userRegister()
                } else if (MAPS["forget"]== pathname) {
                    $scope.is_overview = true
                    $scope.is_forget = true
                    $scope.is_validate = false
                    $scope.is_inBlog = false
                    $scope.forgetPwd()
                } else if (MAPS["email_validate"]== pathname) {
                    $scope.is_overview = true
                    $scope.is_forget = false
                    $scope.is_validate = true
                    $scope.is_inBlog = false
                    $scope.email_validate()
                } else {
                    $scope.is_overview = false
                    $scope.is_forget = false
                    $scope.is_validate = false
                    $scope.is_inBlog = true
                    return
                }
            });
            $scope.reloadPage = function() {
                 location.reload()
            };
/*
            //实现用户登录或注册以后，导航栏显示名称的功能
            $scope.$on("PageWillReload", function (event, msg) {
                $scope.can_displayname = true
                $scope.name = msg
            })
            $scope.jump = function (id) {
                //BlogApp.anchorScroll.toView('#Layer1', true);
                $rootScope.goto(id)
            };
*/
            if (!!windowSession.UOS) {
                $scope.can_displayname = true
                $scope.name = atob(atob(atob(windowSession.UOS)))
            } else {
                $scope.can_displayname = false
            }
            $scope.logout = function () {
                var userInfo = {}
                var post_data = {
                    sweet_name: $scope.name
                };
                CommonHttpService.post('/api/user/logout/', post_data).then(function (data) {
                    if (data.success) {
                        windowSession.UOS = ""
                        window.location.reload();
                    } else {
                        alert('logout faled')
                    }
                })
            }
        }
    ]
);
BlogApp.controller('ForgetPwdCtrl', function($rootScope, $scope, CommonHttpService, $window, $http, $cookies) {
    //this function need three step, each step has a flag, to judge display this page or not
    $scope.step1Flag = true
    $scope.step2Flag = false
    $scope.step3Flag = false
    $scope.hasSend = false
    $scope.is_right_checkNum = false
    $scope.userCanSee = function() {
        $scope.canSee = true
    }
    $scope.userCanNotSee = function() {
        $scope.canSee = false
    }
    $scope.user = {
        "sweet_name" : "",
        "email":""
    }
    $scope.$watch('user.sweet_name', function(value) {
        if (!!value) {
            if($("#forgetpwd1").hasClass("disabled")) {
                $("#forgetpwd1").removeClass("disabled")
            } else {
                return
            }
        } else {
            if($("#forgetpwd1").hasClass("disabled")) {
                return
            } else {
                $("#forgetpwd1").addClass("disabled")
            }
        }
    });
    $scope.$watch('user.password', function(value) {
        if (!!value) {
            if($("#forgetpwd3").hasClass("disabled")) {
                $("#forgetpwd3").removeClass("disabled")
            } else {
                return
            }
        } else {
            if($("#forgetpwd3").hasClass("disabled")) {
                return
            } else {
                $("#forgetpwd3").addClass("disabled")
            }
        }
    });
    $scope.$watch('user.checkNum', function(value) {
        if (!!value) {
            if($("#checkNum1").hasClass("disabled")) {
                $("#checkNum1").removeClass("disabled")
            } else {
                return
            }
        } else {
            if($("#checkNum1").hasClass("disabled")) {
                return
            } else {
                $("#checkNum1").addClass("disabled")
            }
        }
    });
    $scope.goStep1 = function() {
        $scope.step1Flag = true;
        $scope.step2Flag = false;
        $scope.step3Flag = false;
    };
    $scope.goStep2 = function() {
        $scope.step1Flag = false;
        $scope.step2Flag = true;
        $scope.step3Flag = false;
    };
    $scope.goStep3 = function() {
        $scope.step1Flag = false;
        $scope.step2Flag = false;
        $scope.step3Flag = true;
    };
    // 检查 用户名邮箱是否一致
    $scope.checkNameEmail = function(user) {
        //$scope.hasClicked = true
        var postdata = {
            "email": user.email,
            "sweet_name": user.sweet_name
        }
        CommonHttpService.post("/api/user/checkNameEmail/", postdata).then(function (data) {
            if (data.success) {
                //检查用户名与邮箱一致，进入第二步，
                $scope.goStep2()
            } else {
                alert("------")
            }
        });
    }
    //要求服务器发送验证码
    $scope.send_checkNum = function(user) {
        $scope.hasSend = true
        var postdata = {
            "email": user.email,
            "sweet_name": user.sweet_name
        }
        CommonHttpService.post("/api/user/sendCheckNum/", postdata).then(function (data) {
            if (data.success) {
                //验证码发送成功
            } else {
                alert("------")
            }
        });
    }
    //检查验证码，是否相符
    $scope.check_num_is_right = function(user) {
        var postdata = {
            "email": user.email,
            "sweet_name": user.sweet_name,
            "random_num" : user.checkNum
        }
        CommonHttpService.post("/api/user/check_num_is_right/", postdata).then(function (data) {
            if (data.success) {
                //验证码验证成功，进入第三步，重新设置密码
                $scope.goStep3()
            } else {
                alert("------")
            }
        });
    };
    //修改密码
    $scope.submit = function(user) {
        var password = ($.md5(user.password));
        var postdata = {
            "email": user.email,
            "sweet_name": user.sweet_name,
            "password": password
        };
        CommonHttpService.post("/api/user/change_password_by_email/", postdata).then(function (data) {
            if (data.success) {
                //密码修改成功
                alert("hahaha")
            } else {
                alert("------")
            }
        });
    }
})
BlogApp.controller('EmailValidateCtrl', function($rootScope, $scope, CommonHttpService,
                                                          $window, $http, $cookies, $cookieStore) {
    $scope.hasClicked = false;
    $scope.emailSendSuccess = false;
    $scope.emailSendfailed = false;
    $scope.windowSession = window.localStorage
    $scope.username = $scope.windowSession.USD
    $scope.password = $scope.windowSession.USP
    function getUserName(value) {
        value = window.atob(value);
        value = window.atob(value);
        value = window.atob(value);
        return value
    }
    $scope.username = getUserName($scope.username);
    $scope.password = getUserName($scope.password);
    $scope.user = {
        "name" : $scope.username,
        "password": $scope.password,
        "email":""
    }
    $scope.validateEmails = function(user) {
        $scope.hasClicked = true
        var postdata = {
            "email": user.email,
            "password": user.password,
            "username": user.name
        }
        CommonHttpService.post("/api/user/check_email/", postdata).then(function (data) {
            if (data.success) {
                $scope.emailSendSuccess = true
            } else {
                $scope.emailSendfailed = true
            }
        });
    }
})
BlogApp.controller('LoginCtrl', function($rootScope, $scope, CommonHttpService, $window, $http, $cookies) {
        $scope.$on('$includeContentLoaded', function(){
            $cookies.put("USN","haha");
        });
        $scope.user = {
            "username": "",
            "password": "",
            "sweet_name": ""
        };
        $scope.$watch('user.sweet_name', function(value) {
            if (!!value) {
                if($("#loginBtn").hasClass("disabled")) {
                    $("#loginBtn").removeClass("disabled")
                } else {
                    return
                }
            } else {
                if($("#loginBtn").hasClass("disabled")) {
                    return
                } else {
                    $("#loginBtn").addClass("disabled")
                }
            }
        });
        $scope.goblogs = function () {
            window.location.replace('http://' + window.location.host + '/blogsite/blogs/');
        }
        $scope.userLogin = function (oldUser) {
            //用户名django默认的表限制是30个字符的长度，这里截取的是(用户名+密码)用MD5加密后一共32位的中间30位,作为用户名。
            $scope.user.username = $scope.user.sweet_name + $scope.user.password
            $scope.user.password = ($.md5($scope.user.password));
            $scope.user.username = ($.md5($scope.user.username));
            $scope.user.username = $scope.user.username.substring(1, 30);
            var post_data = {
                username: $scope.user.username,
                sweet_name: oldUser.sweet_name,
                password: oldUser.password,
            };
            $scope.windowSession = window.localStorage
            CommonHttpService.post('/api/user/login/', post_data).then(function (data) {
                if (data.success) {
                    $scope.windowSession["UOS"] = data.MSG.username;
                    $scope.goblogs()
                } else {
                    $scope.user.password = ""
                    alert("用户名或密码错误")
                }
            })
        }
})
BlogApp.controller('RegisterCtrl', function($rootScope, $scope, CommonHttpService, $cookieStore, $cookies) {
    //user can see password , when press mouse
    $scope.canSee = false
    $scope.userCanSee = function() {
        $scope.canSee = true
    }
    $scope.userCanNotSee = function() {
        $scope.canSee = false
    }
    $scope.goemailPage = function () {
        window.location.replace('http://' + window.location.host + '/blogsite/email_validate/');
    }
    // it should make validater
    $scope.$watch('user.sweet_name', function (value) {
        if (!!value) {
            if ($("#registerBtn").hasClass("disabled")) {
                $("#registerBtn").removeClass("disabled")
            } else {
                return
            }
        } else {
            if ($("#registerBtn").hasClass("disabled")) {
                return
            } else {
                $("#registerBtn").addClass("disabled")
            }
        }
    });
    $scope.windowSession = window.localStorage
    $scope.newUserRegister = function (newUser) {
        $scope.user.username = $scope.user.sweet_name + $scope.user.password
        $scope.user.password = ($.md5($scope.user.password));
        $scope.user.username = ($.md5($scope.user.username));
        $scope.user.username = $scope.user.username.substring(1, 30);
        var post_data = {
            username: $scope.user.username,
            sweet_name: newUser.sweet_name,
            password: newUser.password,
            tips: newUser.tips,
        };
        CommonHttpService.post('/api/user/register/', post_data).then(function (data) {
            if (data.success) {
                $scope.windowSession.USD = data.MSG.usd
                $scope.windowSession.USP = data.MSG.usp
                $scope.goemailPage()
            } else {
                alert("save register user failed")
            }
        });
    };
})
BlogApp.controller('UserSettingController',
    function ($rootScope, $scope, $q, $http, $interval, $location,
              CommonHttpService, UserInfo, CommonAlert, Trans) {
        $scope.user = {}
        $scope.myFile=null

        $scope.$on('$includeContentLoaded', function(){
            UserInfo.query(function (data) {
                $scope.user = data[0]
                if (!$scope.user.headshot) {
                    $scope.user.headshot = '/static/upload/img/default.png'
                }
                angular.element("input[data-role=tagsinput]").val($scope.user.label)
                $("input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput();
            });
        });

        $scope.set_finished = function () {
            var post_data = {
                sex : $scope.user.sex,
                signature: $scope.user.signature,
                birthday: $scope.user.birthday,
                company: $scope.user.company,
                job_type: $scope.user.job_type,
                local : $scope.user.local,
                first_name :$scope.user.first_name,
                qq: $scope.user.qq,
                wechat: $scope.user.wechat

            }
            post_data.label = angular.element(".bootstrap-tagsinput").text()
            CommonHttpService.post("/api/user/setted/", post_data).then(function (data) {
                if(data.success) {
                    var title = Trans.Trans("status.success")
                    var content = Trans.Trans("set.save_success")
                    CommonAlert.successTimer(title, content)
                } else {
                    var title = Trans.Trans("status.error")
                    var content = Trans.Trans("set.save_error")
                    CommonAlert.errorTimer(title, content)
                }
            })
        }
});
BlogApp.controller('ImgUpdateController',
    function ($rootScope, $scope, CommonHttpService, UserInfo, $http, $interval, $location, fileReader, $q) {
        angular.element("#uploadLabel").click(function () {
            angular.element("input[type='file']").trigger("click");
        })
        $scope.getFile = function () {
            var deferred = $q.defer();
            fileReader.readAsDataUrl($scope.myFile, $scope).then(function successCallback(response) {
                deferred.resolve(response);
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                deferred.reject();
            });
            var file = $("#file").val();
            var fileName = getFileName(file);
            function getFileName(o) {
                var pos = o.lastIndexOf("\\");
                return o.substring(pos + 1);
            }
            deferred.promise.then(function (response) {
                $scope.imageSrc = response;
                var postData = {
                    file: $scope.imageSrc,
                    filename: fileName
                }
                var promise = postMultipart('/api/user/upload/', postData);
                promise.success(function(data, status, header, config) {
                    UserInfo.query(function (data) {
                        $scope.user = data[0]
                    });
                }).error(function(data, status, headers, config) {
                    alert("error")
                });
                function postMultipart(url, data) {
                    var fd = new FormData();
                    angular.forEach(data, function (val, key) {
                        fd.append(key, val);
                    });
                    var args = {
                        method: 'POST',
                        url: url,
                        data: fd,
                        headers: {
                            'Content-Type': undefined,
                            'enctype': "multipart/form-data"
                        },
                        transformRequest: angular.identity
                    };
                    return $http(args);
                }
            });
        };
});
/* Setup Layout Part - Footer */
BlogApp.controller('MainController',
    function ($scope, $rootScope, $interval, $http,
              Trans, $location, $anchorScroll, $window, CommonHttpService) {
        $scope.overview_display
        /*
         *  page cover
         * */
        //锚点
        $rootScope.goto = function (id) {
            $location.hash(id);
            $anchorScroll()
        };
        $scope.welcome_word_class = "show-slow0"
        $scope.setaction = function () {
            $interval(function () {
                $scope.logined_flag = false;
                $scope.can_message = true
            }, 5400);
        }
        //判断是否在同一会话中，如果在的话保持登录状态
        // $scope.windowSession["userInfo"].length 并不是固定的，50 是随便取的数
        function init() {
            if ($scope.windowSession["userInfo"] != undefined
                && $scope.windowSession["userInfo"].length > 50) {
                var userInfo = JSON.parse($scope.windowSession["userInfo"]);
                $scope.logined_flag = true
                $scope.can_dispaly = false
                $scope.can_message = false
                $scope.welcome_word = userInfo.word
            } else {
                $scope.logined_flag = false;
                $scope.can_dispaly = false
                $scope.can_message = false
                $scope.welcome_word = ""
            }
        }
        //等函数setaction定义完，执行初始化
        init()
        /*
         *  page 1
         * */
        /*
         *  page 2
         * */
        //滚动事件触发的动画, 第二个页面
        $scope.has_added = false
        $scope.addPage2Class = function () {
            if ($scope.has_added) {
                return
            }
            if (!$('#img1').hasClass("rtl-cl")) {
                $('#img1').addClass("rtl-cl")
                $('#img2').addClass("rtl-cl")
                $('#img3').addClass("rtl-cl")
                $('#img4').addClass("ltr-cl")
                $('#img5').addClass("ltr-cl")
                $('#img6').addClass("ltr-cl")
            }
            $scope.has_added = true
        };
        // 在前台检查用户是否登录，只有登录的情况下才能跳转到博客界面
        $scope.goblogs = function (type) {
            if ($scope.windowSession["userInfo"] != undefined
                && $scope.windowSession["userInfo"].length > 50) {
                window.location.replace('http://' + window.location.host + '/blogs/all/');
            } else {
                $rootScope.goto('Connect')
            }
        }
        /*
         *  page 3
         * */
        //滚动事件触发第三个页面的动画
        $scope.has_added_pg3 = false
        $scope.addPage3Class = function () {
            if ($scope.has_added_pg3) {
                return
            }
            if (!$('#Aboutus').hasClass("turn-ro-right")) {
                $('#Aboutus').addClass("turn-ro-right")
            }
            $scope.has_added_pg3 = true
        };
        /*
         *  page 4
         * */
        //滚动事件触发第四个页面的动画
        $scope.has_added_pg4 = false
        $scope.addPage4Class = function () {
            if ($scope.has_added_pg4) {
                return
            }
            if (!$('#Connect').hasClass("fade-out-pg4") && !$scope.logined_flag) {
                $('#Connect').addClass("fade-out-pg4")
            }
            //只有当滚动条下拉到底，才显示动画效果
            if ( $scope.logined_flag) {
                $scope.can_dispaly = true
                $scope.setaction()
            }
            $scope.has_added_pg4 = true
        };
        $scope.user = {
            "username": "",
            "password": "",
            "sweet_name": ""
        };
        $scope.is_register = null
        $scope.userLogin = function (oldUser) {
            $scope.user.password = ($.md5($scope.user.password));
            $scope.user.username = ($.md5($scope.user.sweet_name)) + $scope.user.password;
            //用户名django默认的表限制是30个字符的长度，这里截取的是(用户名+密码)用MD5加密后一共64位的中间30位,作为用户名。
            $scope.user.username = $scope.user.username.substring(17, 47);
            var post_data = {
                username: $scope.user.username,
                sweet_name: oldUser.sweet_name,
                password: oldUser.password,
            };
            CommonHttpService.post('/api/blog/login/', post_data).then(function (data) {
                if (data.success) {
                    var userInfo = {
                        is_validuser: true,
                        is_register: false,
                        username: data.MSG.username,
                        word: Trans.Trans("helloLogin") + ',' + data.MSG.username
                    };
                    $scope.windowSession["userInfo"] = JSON.stringify(userInfo);
                    $('#Connect').removeClass("fade-out-pg4")
                    $scope.logined_flag = true
                    $scope.can_dispaly = true
                    $scope.welcome_word = Trans.Trans("helloLogin") + ',' + data.MSG.username;
                    $scope.setaction()
                    $scope.$emit("shouldReload", data.MSG.username);
                } else {
                    $scope.logined_flag = false
                    $scope.can_message = false
                    $scope.user.password = ""
                    alert("用户名或密码错误")
                }
            })
        }
        $scope.newUserRegister = function (newUser) {
            $scope.user.password = ($.md5($scope.user.password));
            $scope.user.username = ($.md5($scope.user.sweet_name)) + $scope.user.password;
            $scope.user.username = $scope.user.username.substring(17, 47);
            $scope.user.username.length
            var post_data = {
                username: $scope.user.username,
                sweet_name: newUser.sweet_name,
                password: newUser.password,
            };
            CommonHttpService.post('/api/blog/register/', post_data).then(function (data) {
                if (data.success) {
                    var userInfo = {
                        is_validuser: true,
                        is_register: true,
                        username: data.MSG.username,
                        word: Trans.Trans("helloRegister") + ',' + data.MSG.username
                    };
                    $scope.windowSession["userInfo"] = JSON.stringify(userInfo);
                    $('#Connect').removeClass("fade-out-pg4")
                    $scope.logined_flag = true
                    $scope.can_dispaly = true
                    $scope.welcome_word = Trans.Trans("helloRegister") + ',' + data.MSG.username;
                    $scope.setaction()
                    $scope.$emit("shouldReload", data.MSG.username);
                } else {
                    $scope.logined_flag = false
                    $scope.can_message = false
                }
            })
        };
    });
// Setup Layout Part - Footer
BlogApp.controller('FooterController', ['$scope', function ($scope) {
    //$scope.$on('$includeContentLoaded', function () {
    //Layout.initFooter(); // init footer
    //});
}]);
/* Setup Rounting For All Pages */
/*
 BlogApp.config(['$stateProvider', '$urlRouterProvider',
 function ($stateProvider, $urlRouterProvider) {
 }]);
 */


