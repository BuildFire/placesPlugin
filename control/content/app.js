(function (angular, buildfire) {
    "use strict";
    //created placesPluginContent module
    angular
        .module('placesContent',
        [
            'placesContentEnums',
            'placesServices',
            'placesFilters',
            'placesModals',
            'ngAnimate',
            'ngRoute',
            'ui.bootstrap',
            'ui.sortable',
            'infinite-scroll',
            'bngCsv',
            'ui.tinymce'

        ])
        //injected ngRoute for routing
        //injected ui.bootstrap for angular bootstrap component
        //injected ui.sortable for manual ordering of list
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'templates/sections.html',
                    controllerAs: 'ContentSections',
                    controller: 'ContentSectionsCtrl',
                    resolve: {
                        PlaceInfo: ['$q', 'DB', 'COLLECTIONS', 'Orders', 'Location', function ($q, DB, COLLECTIONS, Orders, Location) {
                            var deferred = $q.defer();
                            var PlaceInfo = new DB(COLLECTIONS.PlaceInfo);
                            var _bootstrap = function () {
                                PlaceInfo.save({
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
                                }).then(function success() {
                                    Location.goToHome();
                                }, function fail() {
                                    _bootstrap();
                                });
                            };
                            PlaceInfo.get().then(function success(result) {
                                    if (result && result.id && result.data) {
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
                .when('/item/:sectionId', {
                    templateUrl: 'templates/item-content.html',
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
                    controller: 'ContentSectionCtrl',
                    resolve: {
                        section: function () {
                            return null;
                        }
                    }
                })
                .when('/section/:sectionId', {
                    templateUrl: 'templates/section.html',
                    controllerAs: 'ContentSection',
                    controller: 'ContentSectionCtrl',
                    resolve: {
                        section: ['$q', 'DB', 'COLLECTIONS', 'Orders', 'Location', '$route', function ($q, DB, COLLECTIONS, Orders, Location, $route) {
                            var deferred = $q.defer();
                            var Sections = new DB(COLLECTIONS.Sections);
                            var sectionId = $route.current.params.sectionId;
                            if (sectionId) {
                                Sections.getById(sectionId).then(function success(result) {
                                        if (result && result.data) {
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
                .otherwise('/');
        }]);
})
(window.angular, window.buildfire);
