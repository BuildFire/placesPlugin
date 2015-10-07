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
                    controllerAs: 'WidgetSections',
                    controller: 'WidgetSectionsCtrl'
                })
                .when('/item/:sectionId/:itemId', {
                    templateUrl: 'templates/item.html',
                    controllerAs: 'WidgetItem',
                    controller: 'WidgetItemCtrl'
                })
                .when('/item', {
                    templateUrl: 'templates/item.html',
                    controllerAs: 'WidgetItem',
                    controller: 'WidgetItemCtrl'
                })
                .otherwise('/');
        }])
        .run(['Location', 'Messaging', 'EVENTS', 'PATHS', function (Location, Messaging, EVENTS, PATHS) {
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
                                        url = url+"/"+secId + "/" + id;
                                    }
                                    break;
                                case PATHS.HOME:
                                    url = url + "home";
                                    break;
                                case PATHS.SECTION:
                                    if (secId) {
                                        url = url + "items";
                                        url = url + "/" + secId;
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
        }]);


})(window.angular, window.buildfire);