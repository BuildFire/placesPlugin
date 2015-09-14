(function (angular, buildfire) {
    'use strict';
    //created mediaCenterContent module
    angular
        .module('placesSettings',
        [
            'placesEnums',
            'placesSettingsServices',
            'placesSettingsFilters',
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
                    controllerAs: 'SettingsHome',
                    controller: 'SettingsHomeCtrl',
                    resolve: {

                    }
                })
                .otherwise('/');
        }]);
})(window.angular, window.buildfire);
