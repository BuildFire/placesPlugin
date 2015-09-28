(function (angular) {
    angular
        .module('placesWidget')
        .controller('WidgetSectionsCtrl', ['$scope', '$window', 'DB', 'COLLECTIONS', '$rootScope', 'Buildfire', 'AppConfig', 'Messaging', 'EVENTS', 'PATHS', 'Location', 'Orders', 'DEFAULT_VIEWS',
            function ($scope, $window, DB, COLLECTIONS, $rootScope, Buildfire, AppConfig, Messaging, EVENTS, PATHS, Location, Orders, DEFAULT_VIEWS) {

                var WidgetSections = this;
                WidgetSections.showMenu = false;
                WidgetSections.menuTab = 'Category';
                WidgetSections.selectedSections = [];
                WidgetSections.currentCoordinates = [77, 28];
                WidgetSections.info = null;
                WidgetSections.currentView = null;
                console.log('Widget Section Ctrl Loaded', WidgetSections.info);

                var _skip = 0,
                    view = null,
                    currentLayout = '',
                    _limit = 5,
                    searchOptions = {
                        //filter: {"$json.secTitle": {"$regex": '/*'}},
                        skip: _skip,
                        limit: _limit + 1 // the plus one is to check if there are any more
                    };

                /**
                 * WidgetSections.isBusy is used for infinite scroll.
                 * @type {boolean}
                 */
                WidgetSections.isBusy = false;

                /**
                 * Create instance of Sections and Items db collection
                 * @type {DB}
                 */
                var Sections = new DB(COLLECTIONS.Sections),
                    Items = new DB(COLLECTIONS.Items),
                    PlaceInfo = new DB(COLLECTIONS.PlaceInfo);


                /**
                 * updateGetOptions method checks whether sort options changed or not.
                 * @returns {boolean}
                 */
                var updateGetOptions = function () {
                    var _sortBy = (WidgetSections.info && WidgetSections.info.data) ? WidgetSections.info.data.content.sortBy : Orders.ordersMap.Default;
                    var order = Orders.getOrder(_sortBy);
                    if (order) {
                        var sort = {};
                        sort[order.key] = order.order;
                        searchOptions.sort = sort;
                        return true;
                    }
                    else {
                        return false;
                    }
                };

                /**
                 * WidgetSections.items holds the array of items.
                 * @type {Array}
                 */
                WidgetSections.sections = [];
                /**
                 * WidgetSections.noMoreSections checks for further data in Sections
                 * @type {boolean}
                 */
                WidgetSections.noMoreSections = false;

                /**
                 * loadMoreSections method loads the sections in list page.
                 */
                WidgetSections.loadMoreSections = function () {
                    console.log('widget load more called');
                    if (WidgetSections.isBusy && !WidgetSections.noMoreSections) {
                        return;
                    }
                    updateGetOptions();
                    WidgetSections.isBusy = true;

                    Sections.find(searchOptions).then(function success(result) {
                        if (WidgetSections.noMoreSections)
                            return;
                        if (result.length <= _limit) {// to indicate there are more
                            WidgetSections.noMoreSections = true;
                        }
                        else {
                            result.pop();
                            searchOptions.skip = searchOptions.skip + _limit;
                            WidgetSections.noMoreSections = false;
                        }
                        WidgetSections.sections = WidgetSections.sections ? WidgetSections.sections.concat(result) : result;
                        WidgetSections.isBusy = false;
                    }, function fail() {
                        WidgetSections.isBusy = false;
                        console.error('error');
                    });
                };
                //WidgetSections.loadMore();

                WidgetSections.toggleSectionSelection = function (ind, event) {
                    var id = WidgetSections.sections[ind].id;
                    if (WidgetSections.selectedSections.indexOf(id) < 0) {
                        WidgetSections.selectedSections.push(id);
                        $(event.target).addClass('active');
                    }
                    else {
                        WidgetSections.selectedSections.splice(WidgetSections.selectedSections.indexOf(id), 1);
                        $(event.target).removeClass('active');
                    }
                };

                WidgetSections.resetSectionFilter = function () {
                    WidgetSections.selectedSections = [];
                    $('.active.section-filter').removeClass('active');
                };


                function refreshSections() {
                    WidgetSections.sections = [];
                    WidgetSections.noMoreSections = false;
                    WidgetSections.loadMoreSections();
                    $scope.$apply();
                }


                var initCarousel = function (_defaultView) {
                    var resetCarousel = function (_layout) {
                        if (currentLayout !== _layout && view && WidgetSections.info.data.content.images) {
                            currentLayout = _layout;
                            if (WidgetSections.info.data.content.images.length)
                                view._destroySlider();
                            view = null;
                        }
                        else {
                            if (view) {
                                view.loadItems(WidgetSections.info.data.content.images);
                            }
                        }
                    };

                    switch (_defaultView) {
                        case DEFAULT_VIEWS.LIST:
                            resetCarousel(WidgetSections.info.data.design.secListLayout);
                            break;
                        case DEFAULT_VIEWS.MAP:
                            resetCarousel(WidgetSections.info.data.design.mapLayout);
                            break;
                    }
                };

                $scope.$watch(function () {
                    return WidgetSections.selectedSections;
                }, function () {
                    console.log('filter changed', WidgetSections.selectedSections);
                    if (WidgetSections.selectedSections.length) {
                        var itemFilter = {
                            'filter': {'$json.sections': {'$in': WidgetSections.selectedSections}}
                        };

                        Items.find(itemFilter).then(function (res) {
                            WidgetSections.items = res;
                        }, function () {

                        });
                    }

                }, true);


                /**
                 * Buildfire.datastore.onUpdate method calls when Data is changed.
                 */
                Buildfire.datastore.onUpdate(function (event) {
                    if (event.tag == "placeInfo") {
                        if (event.data) {

                            WidgetSections.info = event;
                            WidgetSections.currentView = WidgetSections.info.data.settings.defaultView;

                            initCarousel(WidgetSections.info.data.settings.defaultView);
                            refreshSections();
                        }
                    }
                    else {
                        view = null;
                        currentLayout = '';
                        refreshSections();
                    }
                });

                $rootScope.$on("Carousel:LOADED", function () {
                    if (!view) {
                        view = new Buildfire.components.carousel.view("#carousel", []);
                    }
                    if (WidgetSections.info && WidgetSections.info.data.content && WidgetSections.info.data.content.images) {
                        view.loadItems(WidgetSections.info.data.content.images);
                    } else {
                        view.loadItems([]);
                    }
                });


                /**
                 * init() private function
                 * It is used to fetch previously saved user's data
                 */
                var init = function () {
                    var success = function (result) {
                            if (result && result.data && result.id) {
                                WidgetSections.info = result;
                            }
                            WidgetSections.currentView = WidgetSections.info ? WidgetSections.info.data.settings.defaultView : null;
                            if (WidgetSections.currentView) {
                                switch (WidgetSections.currentView) {
                                    case DEFAULT_VIEWS.LIST:
                                        currentLayout = WidgetSections.info.data.design.secListLayout;
                                        break;
                                    case DEFAULT_VIEWS.MAP:
                                        currentLayout = WidgetSections.info.data.design.mapLayout;
                                        break;
                                }
                            }
                        }
                        , error = function (err) {
                            console.error('Error while getting data', err);
                        };
                    PlaceInfo.get().then(success, error);
                };

                /**
                 * init() function invocation to fetch previously saved user's data from datastore.
                 */
                init();
            }]);
})(window.angular, undefined);