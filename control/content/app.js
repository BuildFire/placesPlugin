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
        .config(['$routeProvider','$httpProvider', function ($routeProvider,$httpProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'templates/sections.html',
                    controllerAs: 'ContentSections',
                    controller: 'ContentSectionsCtrl',
                    resolve: {
                        PlaceInfoData: ['$q', 'DB', 'COLLECTIONS', 'Orders', 'Location', function ($q, DB, COLLECTIONS, Orders, Location) {
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
                    controller: 'ContentItemCtrl'
                })
                .when('/item/:sectionId/:itemId', {
                    templateUrl: 'templates/item.html',
                    controllerAs: 'ContentItem',
                    controller: 'ContentItemCtrl'
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
                        }]
                    }
                })
                .when('/section', {
                    templateUrl: 'templates/section.html',
                    controllerAs: 'ContentSection',
                    controller: 'ContentSectionCtrl'
                })
                .when('/section/:sectionId', {
                    templateUrl: 'templates/section.html',
                    controllerAs: 'ContentSection',
                    controller: 'ContentSectionCtrl'
                })
                .otherwise('/');

            var interceptor=['$q',function($q){
                var counter=0;

                return {

                    request: function (config) {
                        buildfire.spinner.show();
                        //NProgress.start();

                        counter++;
                        return config;
                    },
                    response: function (response) {
                        counter--;
                        if(counter===0)
                        {

                            buildfire.spinner.hide();
                        }
                        return response;
                    },
                    responseError:function(rejection){
                        counter--;
                        if(counter===0)
                        {

                            buildfire.spinner.hide();
                        }

                        return $q.reject(rejection);
                    }
                };
            }];

            $httpProvider.interceptors.push(interceptor);
        }])
        .run(['Location', 'Messaging', 'EVENTS', 'PATHS', function (Location, Messaging, EVENTS, PATHS) {
            // Handler to receive message from widget
            Messaging.onReceivedMessage = function (event) {
                console.log('Event rcv-----on Control Side------------------------?????????????????????????????????---------------********************* in Control Panal side----', event);
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
                                        url = url + "/" +secId+ "/" + id;
                                    }
                                    else if(id){
                                        url = url + "/" + id;
                                    }
                                    break;
                                case PATHS.HOME:
                                    url = url + "home";
                                    break;
                                case PATHS.SECTION:
                                    url = url + "items";
                                    if (secId) {
                                        url = url + "/" + secId;
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
        }]);
})
(window.angular, window.buildfire);