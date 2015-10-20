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
            'infinite-scroll',
            'rzModule'
        ])
        //injected ngRoute for routing
        //injected ui.bootstrap for angular bootstrap component
        //injected ui.sortable for manual ordering of list
        //ngClipboard to provide copytoclipboard feature
        .config(['$routeProvider', '$httpProvider', '$compileProvider', function ($routeProvider, $httpProvider, $compileProvider) {

            /**
             * Disable the pull down refresh
             */
            //buildfire.datastore.disableRefresh();


            /**
             * To make href urls safe on mobile
             */
                //$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|cdvfile):/);

            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|cdvfile|file):/);

            $routeProvider
                .when('/', {
                    templateUrl: 'templates/home.html',
                    controllerAs: 'WidgetSections',
                    controller: 'WidgetSectionsCtrl',
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
                .when('/items/:sectionId', {
                    templateUrl: 'templates/section.html',
                    controllerAs: 'WidgetSections',
                    controller: 'WidgetSectionsCtrl',
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
                .when('/item/:sectionId/:itemId', {
                    templateUrl: 'templates/item.html',
                    controllerAs: 'WidgetItem',
                    controller: 'WidgetItemCtrl',
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
                        }],
                        item: ['DB', 'COLLECTIONS', '$q', '$route', 'Location', function (DB, COLLECTIONS, $q, $route, Location) {
                            var Items = new DB(COLLECTIONS.Items)
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
                            Items.getById($route.current.params.itemId).then(success, error);
                            return deferred.promise;
                        }]
                    }
                })
                .when('/item/:sectionId', {
                    templateUrl: 'templates/item.html',
                    controllerAs: 'WidgetItem',
                    controller: 'WidgetItemCtrl',
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
                        }],
                        item: function () {
                            return null;
                        }
                    }
                })
                .otherwise('/');

            var interceptor = ['$q', function ($q) {
                var counter = 0;
                return {

                    request: function (config) {
                        buildfire.spinner.show();
                        counter++;
                        return config;
                    },
                    response: function (response) {
                        counter--;
                        if (counter === 0) {
                            buildfire.spinner.hide();
                        }
                        return response;
                    },
                    responseError: function (rejection) {
                        counter--;
                        if (counter === 0) {
                            buildfire.spinner.hide();
                        }

                        return $q.reject(rejection);
                    }
                };
            }];

            $httpProvider.interceptors.push(interceptor);

        }])
        .run(['Location', 'Messaging', 'EVENTS', 'PATHS', '$location', function (Location, Messaging, EVENTS, PATHS, $location) {
            Messaging.onReceivedMessage = function (event) {
                console.log('Messaging000000000000000000000------on Widget Side-----------------------------------------', event);
                if (event) {
                    switch (event.name) {
                        case EVENTS.ROUTE_CHANGE:
                            var path = event.message.path,
                                id = event.message.id,
                                secId = event.message.secId;
                            var url = "#/";
                            switch (path) {
                                case PATHS.ITEM:
                                    url = url + "item";
                                    if (secId && id) {
                                        url = url + "/" + secId + "/" + id;
                                    }
                                    else if (secId) {
                                        url = url + "/" + secId;
                                    }
                                    break;
                                case PATHS.HOME:
                                    //url = url + "home";
                                    Location.goToHome();
                                    break;
                                case PATHS.SECTION:
                                    if (secId) {
                                        url = url + "items" + "/" + secId;
                                    }
                                    else {
                                        url = url + "home";
                                    }
                                    break;
                                default :

                                    break
                            }
                            Location.go(url);
                            break;
                    }
                }
            };
            buildfire.deeplink.getData(function (data) {
                if (data) {
                    console.log('data---', data);
                    Location.go("#/item/" + JSON.parse(data).id);
                }

            });

            buildfire.navigation.onBackButtonClick = function () {
                var path = $location.path();
                if (path.indexOf('/items/') == 0)
                    Location.goToHome();
                else if (path.indexOf('/item/') == 0)
                    Location.go('#/items/' + path.split('/')[2]);
            }
        }]);


})(window.angular, window.buildfire);