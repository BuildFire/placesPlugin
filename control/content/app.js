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
        }]);
})
(window.angular, window.buildfire);
