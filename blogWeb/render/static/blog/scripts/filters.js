angular.module('blog.filters', [])

.filter("Trans", ['$translate', function($translate) {
	return function(key) {
		if(key){
			return $translate.instant(key);
		}
	};
}])





;