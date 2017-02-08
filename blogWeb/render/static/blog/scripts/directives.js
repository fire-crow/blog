angular.module('blog.directives', [])

.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(event){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
                //附件预览
                scope.file = (event.srcElement || event.target).files[0];
                if (scope.file.size > 102400) {
                    alert("大小要小于100k")
                    return
                }
                if (scope.file.type !="image/jpeg" && scope.file.type !="image/png" && scope.file.type !="image/ico"
                     && scope.file.type !="image/gif") {
                    alert("只支持jpg,gif,png,ico,格式的图像")
                    return
                }

                scope.getFile();
            });
        }
    };
}])
/*
.directive('pinFunc', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$on('$includeContentLoaded', function(){
                $('.pinned').pin({
                    containerSelector: "container-fluid",
                    minWidth: 940
                })
            })
        }
    };
}])
*/
.directive('showMenu', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

            $('#dropdown').click(function(){
                element.addClass("open")
            })
        }
    };
}])

.directive('bigerDatePicker', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $.fn.datetimepicker.dates['cn'] = {
                clear:"清除",
                days: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                daysMin: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                meridiem: ["am", "pm"],
                months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                suffix:["第一季度", "第二季度", "第三季度", "第四季度"],
                today: "今天"
            };
            $('#datetimepicker').datetimepicker({
                language:'cn',
                format: 'yyyy-mm-dd',
                todayBtn: true,
                startView:4,
                minView:2,
                autoclose: true,
                todayHighlight:true,
                keyboardNavigation:true,
                forceParse:true
            });
        }
    };
}])





/*实现动画的第一种方法，这个不能复用
// 实现滚动加载的动画效果
.directive('myScroll', function() {
    return{
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {
            var raw = element[0];
            var topflag = false
            var btmflag = false
            var has_added = false
            var has_remove = true
            $(window).scroll(function () {
                //滚动条到顶端的距离
                scope.scrollTop = $(this).scrollTop();
                //可视页面的长度
                scope.scrollHeight = $(document).height();
                //滚动条的长度
                scope.windowHeight = $(this).height();
                //引用本属性的元素到顶端的距离
                scope.eleOffsetTop = raw.offsetTop
                if (scope.scrollTop + scope.windowHeight >  scope.eleOffsetTop + 200) {
                    topflag = true
                } else {
                    topflag = false
                }
                if (scope.scrollTop + scope.windowHeight <  scope.eleOffsetTop + 800) {
                    btmflag = true
                } else {
                    btmflag = false
                }
                //在滚动条滑动到元素附近时执行方法，或者触发事件
                if ( topflag && btmflag ) {
                    if (!has_added && has_remove) {
                        $('#img1').addClass("rtl-cl")
                        $('#img2').addClass("rtl-cl")
                        $('#img3').addClass("rtl-cl")
                        $('#img4').addClass("ltr-cl")
                        $('#img5').addClass("ltr-cl")
                        $('#img6').addClass("ltr-cl")
                        has_added = true
                    }
                    if (has_added) {
                        $('#img1').removeClass("rtl-cl-dis")
                        $('#img2').removeClass("rtl-cl-dis")
                        $('#img3').removeClass("rtl-cl-dis")
                        $('#img4').removeClass("ltr-cl-dis")
                        $('#img5').removeClass("ltr-cl-dis")
                        $('#img6').removeClass("ltr-cl-dis")
                        has_remove = true
                    }


                } else if ((topflag && !btmflag ) ||  (!topflag && btmflag )) {
                    if (has_added) {
                        $('#img1').removeClass("rtl-cl")
                        $('#img2').removeClass("rtl-cl")
                        $('#img3').removeClass("rtl-cl")
                        $('#img4').removeClass("ltr-cl")
                        $('#img5').removeClass("ltr-cl")
                        $('#img6').removeClass("ltr-cl")
                        has_added = false
                    }
                    if (has_remove && !has_added) {
                        $('#img1').addClass("rtl-cl-dis")
                        $('#img2').addClass("rtl-cl-dis")
                        $('#img3').addClass("rtl-cl-dis")
                        $('#img4').addClass("ltr-cl-dis")
                        $('#img5').addClass("ltr-cl-dis")
                        $('#img6').addClass("ltr-cl-dis")
                        has_remove = true
                    }

                }
            })
        }
    }
})
*/
.directive('myScroll',function($window) {
    return function(scope, element, attrs) {
        var raw = element[0]
        var topflag = false;
        var btmflag = false;
        var intop = false;
        var atbotton = false;

        angular.element($window).bind("scroll", function() {
            scope.scrollTop = $(this).scrollTop();
                //可视页面的长度
            scope.scrollHeight = $(document).height();
            //滚动条的长度
            scope.windowHeight = $(this).height();
            //引用本属性的元素到顶端的距离
            scope.eleOffsetTop = raw.offsetTop;

            if(!scope.scrollTop) {
                intop = true
                scope.$apply(attrs.enterHeadScroll)
            } else {
                intop = false
                scope.$apply(attrs.leaveHeadScroll)
            }

            if (scope.scrollTop + scope.windowHeight == scope.scrollHeight) {
                atbotton = true
                scope.$apply(attrs.enterScroll)
                scope.$apply(attrs.enterBottomScroll)
            } else {
                atbotton = false
                scope.$apply(attrs.leaveBottomScroll)
            }

            if (!atbotton && !intop){
                intop = false
                atbotton = false
                if (scope.scrollTop + scope.windowHeight >  scope.eleOffsetTop + 150) {
                    topflag = true
                } else {
                    topflag = false
                }
                if (scope.scrollTop + scope.windowHeight <  scope.eleOffsetTop + 800) {
                    btmflag = true
                } else {
                    btmflag = false
                }
                //在滚动条滑动到元素附近时执行方法，或者触发事件
                if ( topflag && btmflag) {
                    scope.$apply(attrs.enterScroll)
                } else if ((topflag && !btmflag ) ||  (!topflag && btmflag )) {
                    scope.$apply(attrs.leaveScroll)

                } else {
                    scope.$apply(attrs.dealSomthing)
                }

            }




        })
    }

})






;
