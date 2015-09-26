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
                    controller: 'WidgetItemCtrl',
                    resolve: {
                        PlaceInfo: ['$q', 'DB', 'COLLECTIONS', 'Orders', 'Location',
                            function ($q, DB, COLLECTIONS, Orders, Location) {
                                var deferred = $q.defer();
                                var PlaceInfo = new DB(COLLECTIONS.PlaceInfo);
                                PlaceInfo.get().then(function success(result) {
                                        if (result && result.data && result.id) {
                                            deferred.resolve(result);
                                        }
                                        else {
                                            Location.goToHome();
                                        }
                                    },
                                    function fail(error) {
                                        throw (error);
                                    }
                                );
                                return deferred.promise;
                            }]
                    }
                })
                .otherwise('/');
        }])


})(window.angular, window.buildfire);
