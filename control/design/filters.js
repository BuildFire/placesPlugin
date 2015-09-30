(function (angular, buildfire, location) {
    "use strict";
    //created mediaCenterWidget module
    angular
        .module('placesDesignFilters', [])
        .filter('resizeImage', [function () {
            return function (url, width, height) {
                return buildfire.imageLib.resizeImage(url, {
                    width: width,
                    height: height
                });
            };
        }]);
})(window.angular, window.buildfire, window.location);