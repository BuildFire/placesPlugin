(function (angular, buildfire) {
    "use strict";
    //created placesWidgetFilters module
    angular
        .module('placesWidgetFilters', [])
        .filter('resizeImage', [function () {
            return function (url, width, height, type) {
                return buildfire.imageLib.resizeImage(url, {
                    width: width,
                    height: height
                });
            };
        }])
        .filter('cropImage', [function () {
            return function (url, width, height, type) {
                return buildfire.imageLib.cropImage(url, {
                    width: width,
                    height: height
                });
            };
        }])
        .filter('safeHtml', ['$sce', function ($sce) {
            return function (html) {
                if (html) {
                    return $sce.trustAsHtml(html);
                }
                else {
                    return "";
                }
            };
        }])
        .filter('unique', function () {
            return function (collection, keyname) {
                var output = [],
                    keys = [];
                angular.forEach(collection, function (item) {
                    var key = item[keyname];
                    if (keys.indexOf(key) === -1) {
                        keys.push(key);
                        output.push(item);
                    }
                });
                return output;
            };
        });
})(window.angular, window.buildfire);