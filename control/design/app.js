(function (angular, buildfire) {
    'use strict';
    //created mediaCenterContent module
    angular
        .module('placesDesign',
        [
            'placesEnums',
            'placesDesignServices',
            'placesDesignFilters',
            'ngAnimate',
            'ngRoute'
        ])
        //injected ngRoute for routing
        //injected ui.bootstrap for angular bootstrap component
        //injected ui.sortable for manual ordering of list
        //ngClipboard to provide copytoclipboard feature
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'templates/home.html',
                    controllerAs: 'DesignHome',
                    controller: 'DesignHomeCtrl'
                })
                .otherwise('/');
        }]);
})(window.angular, window.buildfire);
