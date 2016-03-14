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
                    var $html = $('<div />', {html: html});
                    $html.find('iframe').each(function (index, element) {
                        var src = element.src;
                        console.log('element is: ', src, src.indexOf('http'));
                        src = src && src.indexOf('file://') != -1 ? src.replace('file://', 'http://') : src;
                        element.src = src && src.indexOf('http') != -1 ? src : 'http:' + src;
                    });
                    return $sce.trustAsHtml($html.html());
                } else {
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