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
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'templates/sections.html',
                    controllerAs: 'ContentSections',
                    controller: 'ContentSectionsCtrl'
                })
                .when('/item/:sectionId', {
                    templateUrl: 'templates/item.html',
                    controllerAs: 'ContentItem',
                    controller: 'ContentItemCtrl',
                    resolve: {
                        item: function () {
                            return null;
                        }
                    }
                })
                .when('/item/:sectionId/:itemId',
                {
                    templateUrl: 'templates/item.html',
                    controllerAs: 'ContentItem',
                    controller: 'ContentItemCtrl',
                    resolve: {
                        item: ['$q', 'DB', 'COLLECTIONS', 'Orders', 'Location', '$route', function ($q, DB, COLLECTIONS, Orders, Location, $route) {
                            var deferred = $q.defer();
                            var Items = new DB(COLLECTIONS.Items);
                            var itemId = $route.current.params.itemId;
                            if (itemId) {
                                Items.getById(itemId).then(function success(result) {
                                        if (result && result.data) {
                                            console.log(';;;;;;;;;;;', result.data);
                                            deferred.resolve(result);
                                        }
                                        else {
                                            Location.goToHome();
                                        }
                                    },
                                    function fail() {
                                        Location.goToHome();
                                    }
                                );
                            }
                            return deferred.promise;
                        }]
                    }
                })
                .when('/items/:sectionId', {
                    templateUrl: 'templates/items.html',
                    controllerAs: 'ContentItems',
                    controller: 'ContentItemsCtrl'
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
                .when('/test', {
                    templateUrl: 'templates/modals/section.html',
                    controllerAs: 'ContentSectionPopup',
                    controller: 'ContentSectionPopupCtrl'
                })
                .otherwise('/');
        }])
        .run(['Location', 'Messaging','EVENTS','PATHS', function (Location, Messaging,EVENTS,PATHS) {
            // Handler to receive message from widget
            Messaging.onReceivedMessage = function (event) {
                console.log('Event rcv-----------------------------?????????????????????????????????---------------********************* in Control Panal side----', event);
                if (event) {
                    switch (event.name) {
                        case EVENTS.ROUTE_CHANGE:
                            var path = event.message.path,
                                id = event.message.id;
                            var url = "#/";
                            switch (path) {
                                case PATHS.ITEM:
                                    url = url + "item";
                                    if (id) {
                                        url = url + "/" + id;
                                    }
                                    break;
                                case PATHS.HOME:
                                    url = url + "home";
                                    break;
                                case PATHS.SECTION:
                                    url = url + "items";
                                    if (id) {
                                        url = url + "/" + id;
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