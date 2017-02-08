angular.module('blog.factorys', [])

.factory('Trans', ['$translate', function($translate) {
    var Trans = {
        Trans:function(key) {
            if(key){
                return $translate.instant(key);
            }
            return key;
        }
    }
    return Trans;
}])

.factory('fileReader', ["$q", "$log", function($q, $log){
  var onLoad = function(reader, deferred, scope) {
      return function () {
          scope.$apply(function () {
              deferred.resolve(reader.result);
          });
      };
  };
  var onError = function (reader, deferred, scope) {
    return function () {
        scope.$apply(function () {
           deferred.reject(reader.result);
        });
    };
  };
  var getReader = function(deferred, scope) {
    var reader = new FileReader();
    reader.onload = onLoad(reader, deferred, scope);
    reader.onerror = onError(reader, deferred, scope);
    return reader;
  };
  var readAsDataURL = function (file, scope) {
       var deferred = $q.defer();
       var reader = getReader(deferred, scope);
       reader.readAsDataURL(file);
       return deferred.promise;
  };
  return {
      readAsDataUrl: readAsDataURL
  };
}])

.factory('AllBlogs', function($resource) {
    return $resource('/api/blogs/all/:id');
})

.factory('UserInfo', function($resource) {
    return $resource('/api/user/info/:id');
})

.factory('ViewBlog', ['$resource', function($resource) {
    return $resource('/api/blogs/all:blogId', {blogId: '@id'}, {})
}])






;
