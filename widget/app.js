(function (angular, buildfire) {
    'use strict';
    //created mediaCenterWidget module
    angular
        .module('placesWidget', [
            'placesEnums',
            'placesWidgetServices',
            'placesWidgetFilters',
            'ngAnimate',
            'ngRoute',
            'ui.bootstrap',
            'infinite-scroll'
        ])
        //injected ngRoute for routing
        //injected ui.bootstrap for angular bootstrap component
        //injected ui.sortable for manual ordering of list
        //ngClipboard to provide copytoclipboard feature
        .config(['$routeProvider', function ($routeProvider) {

            /**
             * Disable the pull down refresh
             */
                //buildfire.datastore.disableRefresh();

            $routeProvider
                .when('/', {
                    templateUrl: 'templates/home.html',
                    controllerAs: 'WidgetSections',
                    controller: 'WidgetSectionsCtrl'
                })
                .when('/items/:sectionId', {
                    templateUrl: 'templates/section.html',
                    controllerAs: 'WidgetSection',
                    controller: 'WidgetSectionCtrl'
                })
                .when('/item/:itemId', {
                    templateUrl: 'templates/item.html',
                    controllerAs: 'WidgetItem',
                    controller: 'WidgetItemCtrl'
                })
                .otherwise('/');
        }])


})(window.angular, window.buildfire);
