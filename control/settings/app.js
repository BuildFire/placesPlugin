(function (angular, buildfire) {
    'use strict';
    //created mediaCenterContent module
    angular
        .module('placesSettings',
        [
            'placesEnums',
            'placesSettingsServices',
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
                        PlaceInfo: ['$q', 'DB', 'COLLECTIONS', 'Orders', 'Location', function ($q, DB, COLLECTIONS, Orders, Location) {
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
                                        secListLayout: "sec-list-1-1",
                                        mapLayout: "map-1",
                                        itemListLayout: "item-list-1",
                                        itemDetailsLayout: "item-details-1",
                                        secListBGImage: ""
                                    },
                                    settings: {
                                        defaultView: "list",
                                        showDistanceIn: "miles"
                                    }
                                }).then(function success(data) {
                                    Location.go("/");
                                }, function fail(err) {
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
                                function fail(err) {
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
