(function (angular, buildfire, location) {
    "use strict";
    //created mediaCenterWidget module
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
console.log(collection);
                angular.forEach(collection, function (item) {
                    var key = item[keyname];
                    if (keys.indexOf(key) === -1) {
                        keys.push(key);
                        output.push(item);
                    }
                });
                console.log(output);
                return output;
            };
        });
    ;
})(window.angular, window.buildfire, window.location);