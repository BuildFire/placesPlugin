(function (angular, buildfire) {
    "use strict";
    //created placesPluginContent module
    angular
        .module('placesContent',
        [
            'placesContentEnums',
            'placesContentDirectives',
            'placesServices',
            'placesFilters',
            'placesModals',
            'ngAnimate',
            'ngRoute',
            'ui.bootstrap',
            'ui.sortable',
            'infinite-scroll',
            'bngCsv',
            'ui.tinymce',
            'uiSwitch'

        ])
        //injected ngRoute for routing
        //injected ui.bootstrap for angular bootstrap component
        //injected ui.sortable for manual ordering of list
        .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'templates/sections.html',
                    controllerAs: 'ContentSections',
                    controller: 'ContentSectionsCtrl',
                    resolve: {
                        placesInfo: ['$q', 'DB', 'COLLECTIONS', 'Orders', 'Location', function ($q, DB, COLLECTIONS, Orders, Location) {
                            var deferred = $q.defer();
                            var PlaceInfo = new DB(COLLECTIONS.PlaceInfo);

                            PlaceInfo.get().then(function success(result) {
                                    if (result && result.id && result.data) {
                                        deferred.resolve(result);
                                    }
                                    else {
                                        deferred.resolve(null);
                                    }
                                },
                                function fail(err) {
                                    deferred.resolve(null);
                                }
                            );
                            return deferred.promise;
                        }]
                    }
                })
                .when('/item/:sectionId', {
                    templateUrl: 'templates/item.html',
                    controllerAs: 'ContentItem',
                    controller: 'ContentItemCtrl',
                    resolve: {
                        item: function () {
                            return null;
                        },
                        placesInfo: ['$q', 'DB', 'COLLECTIONS', 'Orders', 'Location', function ($q, DB, COLLECTIONS, Orders, Location) {
                            var deferred = $q.defer();
                            var PlaceInfo = new DB(COLLECTIONS.PlaceInfo);

                            PlaceInfo.get().then(function success(result) {
                                    if (result && result.id && result.data) {
                                        deferred.resolve(result);
                                    }
                                    else {
                                        deferred.resolve(null);
                                    }
                                },
                                function fail(err) {
                                    deferred.resolve(null);
                                }
                            );
                            return deferred.promise;
                        }]
                    }

                })
                .when('/item/allitems', {
                    templateUrl: 'templates/item.html',
                    controllerAs: 'ContentItem',
                    controller: 'ContentItemCtrl',
                    resolve: {
                        item: function () {
                            return null;
                        },
                        placesInfo: ['$q', 'DB', 'COLLECTIONS', 'Orders', 'Location', function ($q, DB, COLLECTIONS, Orders, Location) {
                            var deferred = $q.defer();
                            var PlaceInfo = new DB(COLLECTIONS.PlaceInfo);

                            PlaceInfo.get().then(function success(result) {
                                    if (result && result.id && result.data) {
                                        deferred.resolve(result);
                                    }
                                    else {
                                        deferred.resolve(null);
                                    }
                                },
                                function fail(err) {
                                    deferred.resolve(null);
                                }
                            );
                            return deferred.promise;
                        }]
                    }

                })
                .when('/item/:sectionId/:itemId', {
                    templateUrl: 'templates/item.html',
                    controllerAs: 'ContentItem',
                    controller: 'ContentItemCtrl',
                    resolve: {
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
                        }],
                        placesInfo: ['$q', 'DB', 'COLLECTIONS', 'Orders', 'Location', function ($q, DB, COLLECTIONS, Orders, Location) {
                            var deferred = $q.defer();
                            var PlaceInfo = new DB(COLLECTIONS.PlaceInfo);

                            PlaceInfo.get().then(function success(result) {
                                    if (result && result.id && result.data) {
                                        deferred.resolve(result);
                                    }
                                    else {
                                        deferred.resolve(null);
                                    }
                                },
                                function fail(err) {
                                    deferred.resolve(null);
                                }
                            );
                            return deferred.promise;
                        }]
                    }
                })
                .when('/items/:sectionId', {
                    templateUrl: 'templates/items.html',
                    controllerAs: 'ContentItems',
                    controller: 'ContentItemsCtrl',
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
                        sectionInfo: ['DB', 'COLLECTIONS', '$q', '$route', 'Location', function (DB, COLLECTIONS, $q, $route, Location) {
                            var Sections = new DB(COLLECTIONS.Sections)
                                , deferred = $q.defer()
                                , success = function (result) {
                                    if (Object.keys(result.data).length > 0) {
                                        deferred.resolve(result);
                                    }
                                    else {
                                        Location.goToHome();
                                    }
                                }
                                , error = function (err) {
                                    Location.goToHome();
                                };
                            Sections.getById($route.current.params.sectionId).then(success, error);
                            return deferred.promise;
                        }]
                    }
                })
                .when('/allitems', {
                    templateUrl: 'templates/items.html',
                    controllerAs: 'ContentItems',
                    controller: 'ContentItemsCtrl',
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
                        sectionInfo: function () {
                            return 'allitems';
                        }
                    }
                })
                .when('/section', {
                    templateUrl: 'templates/section.html',
                    controllerAs: 'ContentSection',
                    controller: 'ContentSectionCtrl',
                    resolve: {
                        placesInfo: ['DB', 'COLLECTIONS', '$q', function (DB, COLLECTIONS, $q) {
                            var PlaceInfo = new DB(COLLECTIONS.PlaceInfo)
                                , deferred = $q.defer()
                                , success = function (result) {
                                    if (result && Object.keys(result.data).length > 0) {
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
                        sectionInfo: function () {
                            return null;
                        }
                    }
                })
                .when('/section/:sectionId', {
                    templateUrl: 'templates/section.html',
                    controllerAs: 'ContentSection',
                    controller: 'ContentSectionCtrl',
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
                        sectionInfo: ['DB', 'COLLECTIONS', '$q', '$route', 'Location', function (DB, COLLECTIONS, $q, $route, Location) {
                            var Sections = new DB(COLLECTIONS.Sections)
                                , deferred = $q.defer()
                                , success = function (result) {
                                    if (Object.keys(result.data).length > 0) {
                                        deferred.resolve(result);
                                    }
                                    else {
                                        Location.goToHome();
                                    }
                                }
                                , error = function (err) {
                                    Location.goToHome();
                                };
                            Sections.getById($route.current.params.sectionId).then(success, error);
                            return deferred.promise;
                        }]
                    }
                })
                .otherwise('/');

            var interceptor = ['$q', function ($q) {
                var counter = 0;

                return {

                    request: function (config) {
                        buildfire.spinner.show();
                        //NProgress.start();

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
        .run(['Location', 'Messaging', 'EVENTS', 'PATHS', '$rootScope', 'Buildfire', function (Location, Messaging, EVENTS, PATHS, $rootScope, Buildfire) {
            // Handler to receive message from widget
            Messaging.onReceivedMessage = function (event) {

                function sectionURL(url, secId) {
                    url = url + "items";
                    if (secId != 'allitems') {
                        url = url + "/" + secId;
                    }
                    else if (secId == 'allitems') {
                        url = '#/allitems';
                    }
                    else {
                        Location.goToHome();
                    }
                    Location.go(url);
                }

                console.log('Event rcv-----on Control Side------------------------?????????????????????????????????---------------********************* in Control Panal side----', event);
                if (event) {
                    switch (event.name) {
                        case EVENTS.ROUTE_CHANGE:
                            if (event.message.dontPropagate) {
                                $rootScope.dontPropagate = true;
                            }
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
                                    Location.go(url);
                                    break;
                                case PATHS.HOME:
                                    url = url + "home";
                                    Location.go(url);
                                    break;
                                case PATHS.SECTION:
                                    Buildfire.history.get({pluginBreadcrumbsOnly: true}, function (e, h) {
                                        if (e)
                                            sectionURL(url, secId);
                                        else {
                                            if (h && h.length > 1 && h[h.length - 2])
                                                Buildfire.history.pop();
                                            else
                                                sectionURL(url, secId);
                                        }
                                    });
                                    break;
                                default :
                                    Location.go(url);
                                    break;
                            }
                            break;
                    }
                }
            };
        }]);
})
(window.angular, window.buildfire);