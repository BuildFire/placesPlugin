/**
 * Create self executing function to avoid global scope creation
 */
(function (angular, tinymce) {
    'use strict';
    angular
        .module('placesContent')
    /**
     * Inject dependency
     */
        .controller('ContentSectionCtrl', ['$scope',
            function ($scope) {

            }]);
})(window.angular, window.tinymce);