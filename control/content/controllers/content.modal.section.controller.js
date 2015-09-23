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
        .controller('ContentSectionPopupCtrl', ['$scope','$routeParams','DB','COLLECTIONS','Modals','OrdersItems',
            function ($scope,$routeParams,DB,COLLECTIONS,Modals) {



            }]);
})(window.angular, window.tinymce);