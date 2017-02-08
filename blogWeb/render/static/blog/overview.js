/**
 * Created by biggerW
 * Author: 572216278@qq.com
 * Date: 2016-06-23
 */

'use strict';
var BlogApp = angular.module("BlogApp", [
    'ngDialog',
    "blog.factorys",
    "blog.filters",
    'blog.directives',
    'blog.services',
    'pascalprecht.translate',
    'ngAnimate',
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

BlogApp.config(function ($anchorScrollProvider) {
    $anchorScrollProvider.disableAutoScrolling();
});

BlogApp.run(['$anchorScroll', function ($anchorScroll) {
    $anchorScroll.yOffset = 50;
    // 默认向下便宜50px
    // 在此处配置偏移量
}])


//csrf problem can be resolved by this config
BlogApp.config(['$httpProvider', function ($httpProvider, $cookies) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Request-Width'];
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
}]);


//edit a way which can express this is angular variable
BlogApp.config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol("{[{");
    $interpolateProvider.endSymbol("}]}");
}]);

/* Setup App Main Controller */
BlogApp.controller('AppController', ['$scope', '$rootScope', '$interval',
    '$anchorScroll', '$location', 'Trans', '$window',
    function ($scope, $rootScope, $anchorScroll, $location, $interval, Trans, $window) {
        $scope.windowSession = $window.sessionStorage

        $scope.$on("shouldReload", function (event, msg) {
            $scope.$broadcast("PageWillReload", msg);
        })
        if ($scope.windowSession["userInfo"] != undefined
                && $scope.windowSession["userInfo"].length > 50) {
            $scope.overview_display = false
        } else {
            $scope.overview_display = true
        }
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


BlogApp.controller('OverviewController', function($rootScope, $scope, ngDialog, $http, CommonHttpService, $window ) {

    $scope.overview_display
})

BlogApp.controller('HeaderController',
    ['$rootScope', '$scope', '$http', '$interval', '$location', '$anchorScroll', '$window', 'CommonHttpService',
        function ($rootScope, $scope, $http, $interval, $location, $anchorScroll, $window, CommonHttpService) {

            var has_added = false
            var has_remove = true
            $scope.overview_display

            $scope.removeClass = function () {
                if (!has_added && has_remove) {
                    $('#header').addClass("inhead-navbar")
                    has_added = true
                    has_remove = false
                }
            }
            $scope.addHeadClass = function () {
                if (has_added && !has_remove) {
                    $('#header').removeClass("inhead-navbar")
                    has_added = false
                    has_remove = true
                }
            }


            //实现用户登录或注册以后，导航栏显示名称的功能
            $scope.$on("PageWillReload", function (event, msg) {
                $scope.can_displayname = true
                $scope.name = msg
            })

            $scope.jump = function (id) {
                //BlogApp.anchorScroll.toView('#Layer1', true);
                $rootScope.goto(id)
            };
            if ($scope.windowSession["userInfo"] != undefined
                && $scope.windowSession["userInfo"].length > 50) {
                $scope.can_displayname = true
                var userInfo = JSON.parse($scope.windowSession["userInfo"]);
                $scope.name = userInfo.username
            } else {
                $scope.can_displayname = false
            }

            $scope.logout = function () {
                var userInfo = {}
                var post_data = {
                    sweet_name: JSON.parse($scope.windowSession["userInfo"]).username,
                };

                CommonHttpService.post('/api/blog/logout/', post_data).then(function (data) {
                    if (data.success) {
                        $window.sessionStorage['userInfo'] = JSON.stringify(userInfo)
                        window.location.reload();
                    } else {
                        alert('logout faled')
                    }
                })

            }

        }
    ]
);

BlogApp.controller('ImgUpdateController',
    function ($rootScope, $scope, $http, $interval, $location, fileReader, $q) {
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
                var promise = postMultipart('/address/upload/', postData);

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
    }
);

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
