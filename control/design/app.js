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
                    controller: 'DesignHomeCtrl',
                    resolve: {
                        placesInfo: ['DB', 'COLLECTIONS', '$q', function (DB, COLLECTIONS, $q) {
                            var PlaceInfo = new DB(COLLECTIONS.PlaceInfo)
                                , deferred = $q.defer()
                                , success = function (result) {
                                    if (Object.keys(result.data).length > 0) {
                                        deferred.resolve(result);
                                    }
                                    else {
                                        deferred.resolve(null);
                                    }
                                }
                                , error = function (err) {
                                    deferred.resolve(null);
                                };
                            PlaceInfo.get().then(success, error);
                            return deferred.promise;
                        }]
                    }
                })
                .otherwise('/');
        }]);
})(window.angular, window.buildfire);
