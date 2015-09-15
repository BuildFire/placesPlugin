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
        .controller('ContentItemCtrl', ['$scope',
            function ($scope) {
                $scope.itemShow = 'Content';
            }]);
})(window.angular, window.tinymce);