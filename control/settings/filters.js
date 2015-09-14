(function (angular, buildfire, location) {
    "use strict";
    //created mediaCenterWidget module
    angular
        .module('placesSettingsFilters', [])
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
        .filter("jsDate", function () {
            return function (x) {
                return new Date(x);
            };
        });
})(window.angular, window.buildfire, window.location);