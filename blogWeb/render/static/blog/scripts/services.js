angular.module('blog.services', [])

.factory('CommonHttpService',  function($http, $q) {
    return {
        'get': function(api_url) {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url:api_url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, headers, config) {
                defer.reject(data);
            });
            return defer.promise
        },
        'post': function(api_url, post_data) {
            var defer = $q.defer();
            $http({
                method:'POST',
                url:api_url,
                data: $.param(post_data)
            }).success(function(data, status, headers,config){
                defer.resolve(data)
            }).error(function(data, status, headers,config){
                defer.reject(data);
            });
            return defer.promise
        }
    }

})


.factory('CommonAlert',  function(Trans,CommonHttpService) {
    return {
        'success': function(title, content) {
            return swal(title, content, "success")
        },
        'error': function (title, content) {
            return swal(title, content, "error");
        },
        "info": function (title, content) {
            return swal(title, content, "info");
        },
        'successTimer': function(title, content) {
            swal({
              title: title,
              text: content,
              timer: 1500,
              type:"success",
              animation: "slide-from-top",
              showConfirmButton: false
            });
        },
        'errorTimer': function(title, content) {
            swal({
              title: title,
              text: content,
              timer: 1500,
              type:"error",
              animation: "slide-from-top",
              showConfirmButton: false
            });
        },
        'errorTimer': function(title, content) {
            swal({
              title: title,
              text: content,
              timer: 1500,
              type:"error",
              showConfirmButton: false
            });
        },
        'confirm': function (title, content, url, past_data) {
            var confirm = Trans.Trans("confirm")
            var noconfirm = Trans.Trans("noconfirm")
             swal({
                title: title,
                text: content,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: confirm,
                cancelButtonText: noconfirm,
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm){
              if (isConfirm) {
                    CommonHttpService.post(url, past_data).then(function (data) {
                        if(data.success) {
                            swal("Deleted!", "Your imaginary file has been deleted.", "success");
                        } else {
                            swal("Delete fail!", "Your imaginary file has been not  deleted.", "error");
                        }
                    })
              } else {
                swal("Cancelled", "Your imaginary file is safe :)", "error");
              }
            });
        }
    }

})

