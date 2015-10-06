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
                .when('/items', {
                    templateUrl: 'templates/section.html',
                    controllerAs: 'WidgetSection',
                    controller: 'WidgetSectionCtrl'
                })
                .when('/item/:itemId', {
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
        .run(['Location','Messaging','EVENTS','PATHS', function (Location,Messaging,EVENTS,PATHS) {
            Messaging.onReceivedMessage = function (event) {
                console.log('RED&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&**************',event);
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
            buildfire.deeplink.getData(function (data) {
                if (data) {
                    console.log('data---',data);
                    Location.go("#/item/" + JSON.parse(data).id);
                }

            });
        }]);


})(window.angular, window.buildfire);