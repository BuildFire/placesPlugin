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
                        PlaceCenterInfo: ['$q', 'DB', 'COLLECTIONS', 'Orders', 'Location', function ($q, DB, COLLECTIONS, Orders, Location) {
                            var deferred = $q.defer();
                            var PlaceCenter = new DB(COLLECTIONS.PlaceInfo);
                            var _bootstrap = function () {
                                PlaceCenter.save({
                                    content: {
                                        images: [],
                                        descriptionHTML: '',
                                        description: '',
                                        sortBy: Orders.ordersMap.Newest,
                                        rankOfLastItem: ''
                                    },
                                    design: {
                                        secListLayout:"",
                                        mapLayout:"",
                                        itemListLayout:"",
                                        itemDetailsLayout: "list-1",
                                        secListBGImage: "item-1"
                                    }
                                }).then(function success() {
                                    Location.go("/");
                                }, function fail() {
                                    _bootstrap();
                                });
                            };
                            PlaceCenter.get().then(function success(result) {
                                    if (result && result.data && result.data.content && result.data.design) {
                                        deferred.resolve(result);
                                    }
                                    else {
                                        //error in bootstrapping
                                        _bootstrap(); //bootstrap again  _bootstrap();
                                    }
                                },
                                function fail() {
                                    Location.goToHome();
                                }
                            );
                            return deferred.promise;
                        }]
                    }
                })
                .otherwise('/');
        }]);
})(window.angular, window.buildfire);
