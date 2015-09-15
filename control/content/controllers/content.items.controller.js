/**
 * Create self executing funton to avoid global scope creation
 */
(function (angular, tinymce) {
    'use strict';
    angular
        .module('placesContent')
    /**
     * Inject dependency
     */
        .controller('ContentItemsCtrl', ['$scope',
            function ($scope) {

            }]);
})(window.angular, window.tinymce);