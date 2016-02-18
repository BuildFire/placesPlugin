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

           /* $routeProvider
                .when('/', {
                    templateUrl: 'templates/home.html',
                    controllerAs: 'WidgetSections',
                    controller: 'WidgetSectionsCtrl',
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
                        }]
                    }
                })
                .when('/items/:sectionId', {
                    templateUrl: 'templates/home.html',
                    controllerAs: 'WidgetSections',
                    controller: 'WidgetSectionsCtrl',
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
                        item: ['DB', 'COLLECTIONS', '$q', '$route', 'Location', function (DB, COLLECTIONS, $q, $route, Location) {
                            var Items = new DB(COLLECTIONS.Items)
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
                        item: function () {
                            return null;
                        }
                    }
                })
                .otherwise('/');*/

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
        .run(['Location', 'Messaging', 'EVENTS', 'PATHS', '$location', '$rootScope','ViewStack', function (Location, Messaging, EVENTS, PATHS, $location, $rootScope,ViewStack) {
           /* Messaging.onReceivedMessage = function (event) {
                console.log('Widget syn called-----', event);
                if (event) {
                    switch (event.name) {
                        case EVENTS.ROUTE_CHANGE:
                            var path = event.message.path,
                                id = event.message.id,
                                secId = event.message.secId;
                            switch (path) {
                                case PATHS.ITEM:
                                        ViewStack.push({
                                            template: "item",
                                            sectionId: secId,
                                            itemId: id
                                        });
                                    break;
                                case PATHS.HOME:

                                    break;
                                case PATHS.SECTION:
                                        ViewStack.push({
                                            template: "section",
                                            sectionId: secId
                                        });

                                default :
                                    break;
                            }
                            break;
                    }
                }
            };*/
            buildfire.deeplink.getData(function (data) {
                if (data) {
                    console.log('data---', data);
                    Location.go("#/item/" + JSON.parse(data).id);
                }

            });

            buildfire.navigation.onBackButtonClick = function () {
                if (ViewStack.hasViews()) {
                    ViewStack.pop();
                } else {
                    buildfire.navigation._goBackOne();
                }
            };

           /* buildfire.navigation.onBackButtonClick = function () {
                var path = $location.path();
                console.log(path);
                if (path.indexOf('/items/') == 0) {
                    //alert(1);
                    Location.goToHome();
                }
                else if (path.indexOf('/item/') == 0) {
                    //alert(2);
                    Location.go('#/items/' + path.split('/')[2]);
                }
                else {
                    if ($('.section-filter.whiteTheme').length == 0) // this means filter is applied
                    {//alert(3);
                        buildfire.navigation._goBackOne();
                    }
                    else {
                        //alert(4);
                       //manuallyTransitionAnimation();
                        $rootScope.$broadcast(EVENTS.ROUTE_CHANGE_1, null);
                    }
                }
            }*/
        }]);
})(window.angular, window.buildfire);