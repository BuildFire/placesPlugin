(function (angular) {
    angular
        .module('placesWidget')
        .controller('WidgetSectionsCtrl', ['$scope', '$window', 'DB', 'COLLECTIONS', '$rootScope', 'Buildfire', 'AppConfig', 'Messaging', 'EVENTS', 'PATHS', 'Location', 'Orders', 'DEFAULT_VIEWS', 'GeoDistance',
            function ($scope, $window, DB, COLLECTIONS, $rootScope, Buildfire, AppConfig, Messaging, EVENTS, PATHS, Location, Orders, DEFAULT_VIEWS, GeoDistance) {

                var WidgetSections = this;
                WidgetSections.showMenu = false;
                WidgetSections.menuTab = 'Category';
                WidgetSections.selectedSections = [];
                WidgetSections.showSections = true;
                WidgetSections.info = null;
                WidgetSections.currentView = null;
                WidgetSections.items = null;
                WidgetSections.selectedItem = null;
                WidgetSections.selectedItemDistance = null;
                WidgetSections.sortOnClosest = false; // default value
                //console.log('Widget Section Ctrl Loaded', WidgetSections.info);
                WidgetSections.locationData = {
                    items: null,
                    currentCoordinates: [-117.1920427, 32.7708401] // default san diego
                };

                function getGeoLocation() {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            $scope.$apply(function () {
                                WidgetSections.sortOnClosest = true;// will be true if user allows location
                                WidgetSections.locationData.currentCoordinates = [position.coords.longitude, position.coords.latitude];
                                localStorage.setItem('userLocation', JSON.stringify(WidgetSections.locationData.currentCoordinates));
                            });
                        });
                    }
                    // else - in this case, default coords will be used
                }

                if (typeof(Storage) !== "undefined") {
                    var userLocation = localStorage.getItem('userLocation');
                    if (userLocation) {
                        WidgetSections.sortOnClosest = true;// will be true if user allows location
                        WidgetSections.locationData.currentCoordinates = JSON.parse(userLocation);
                    }
                    else
                        getGeoLocation(); // get data if not in cache
                }
                else
                    getGeoLocation(); // get data if localStorage is not supported


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

                var loadAllItemsOfSections = function () {
                    var itemFilter = {filter: {"$json.itemTitle": {"$regex": '/*'}}};
                    WidgetSections.items = null;
                    WidgetSections.locationData.items = null;
                    updateGetOptions();
                    Items.find(itemFilter).then(function (res) {
                        WidgetSections.items = res;
                        WidgetSections.locationData.items = angular.copy(WidgetSections.items);
                    }, function () {

                    });

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
                    WidgetSections.showSections = false;
                    var id = WidgetSections.sections[ind].id;
                    if (WidgetSections.selectedSections.indexOf(id) < 0) {
                        WidgetSections.selectedSections.push(id);
                        $(event.target).addClass('active');
                    }
                    else {
                        WidgetSections.selectedSections.splice(WidgetSections.selectedSections.indexOf(id), 1);
                        $(event.target).removeClass('active');
                        if (!WidgetSections.showSections && WidgetSections.selectedSections.length == 0) {
                            WidgetSections.showSections = true;
                        }
                    }
                };

                WidgetSections.resetSectionFilter = function () {
                    if (!WidgetSections.showSections && WidgetSections.selectedSections.length == 0) {
                        WidgetSections.showSections = true;
                        return;
                    }
                    WidgetSections.showSections = false;
                    WidgetSections.selectedSections = [];
                    filterChanged();
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

                function filterChanged() {
                    if (selectedSectionsWatcherInit) {
                        selectedSectionsWatcherInit = false;
                        return;
                    }
                    var itemFilter;
                    console.log('filter changed', WidgetSections.selectedSections);
                    if (WidgetSections.selectedSections.length) {
                        itemFilter = {
                            'filter': {'$json.sections': {'$in': WidgetSections.selectedSections}}
                        };
                    }
                    else {
                        itemFilter = {filter: {"$json.itemTitle": {"$regex": '/*'}}};
                    }
                    Items.find(itemFilter).then(function (res) {

                        res.forEach(function (_item) {
                            _item.data.distance = 0; // default distance value
                            _item.data.distanceText = 'Fetching..';
                        });

                        WidgetSections.items = res;
                    }, function () {

                    });


                }

                var selectedSectionsWatcherInit = true;
                $scope.$watch(function () {
                    return WidgetSections.selectedSections;
                }, filterChanged, true);


                /**
                 * Buildfire.datastore.onUpdate method calls when Data is changed.
                 */
                Buildfire.datastore.onUpdate(function (event) {
                    if (event.tag === "placeInfo") {
                        if (event.data) {
                            WidgetSections.info = event;
                            WidgetSections.currentView = WidgetSections.info.data.settings.defaultView;
                            initCarousel(WidgetSections.info.data.settings.defaultView);
                            refreshSections();
                        }
                    }
                    else if (event.tag === "items") {
                        if (event.data) {
                            if (event.data.address && event.data.address.lng && event.data.address.lat) {
                                loadAllItemsOfSections();
                            }
                        } else if (event.id && WidgetSections.locationData.items) {
                            for (var _index = 0; _index < WidgetSections.locationData.items.length; _index++) {
                                if (WidgetSections.locationData.items[_index].id == event.id) {
                                    WidgetSections.locationData.items.splice(_index, 1);
                                    break;
                                }
                            }
                            WidgetSections.selectedItem = null;
                            WidgetSections.selectedItemDistance = null;
                            WidgetSections.items = angular.copy(WidgetSections.locationData.items);
                            $scope.$apply();
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

                                if (WidgetSections.info.data.settings.showDistanceIn == 'miles')
                                    $scope.distanceSlider = {
                                        min: 50,
                                        max: 50,
                                        ceil: 200, //upper limit
                                        floor: 50
                                    };
                                else
                                    $scope.distanceSlider = {
                                        min: 80,
                                        max: 80,
                                        ceil: 320, //upper limit
                                        floor: 80
                                    };
                            }
                            WidgetSections.currentView = WidgetSections.info ? WidgetSections.info.data.settings.defaultView : null;
                            if (WidgetSections.currentView) {
                                switch (WidgetSections.currentView) {
                                    case DEFAULT_VIEWS.LIST:
                                        currentLayout = WidgetSections.info.data.design.secListLayout;
                                        break;
                                    case DEFAULT_VIEWS.MAP:
                                        WidgetSections.items = null;
                                        loadAllItemsOfSections();
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


                $scope.distanceSliderChange = function () {
                    console.log('slider chnged');
                    //remove items from collection which are out of range
                    for (var i = WidgetSections.items.length - 1; i >= 0; i--) {
                        if (WidgetSections.items[i].data.distance <= 0 || WidgetSections.items[i].data.distance > $scope.distanceSlider.max || WidgetSections.items[i].data.distance < $scope.distanceSlider.min) {
                            WidgetSections.items.splice(i, 1);
                        }
                    }
                };

                WidgetSections.itemsOrder = function (item) {
                    //console.error(WidgetSections.info.data.content.sortByItems);
                    if (WidgetSections.sortOnClosest)
                        return item.data.distance;
                    else
                        return item.data.itemTitle;
                };

                WidgetSections.selectedMarker = function (itemIndex) {
                    WidgetSections.selectedItem = WidgetSections.locationData.items[itemIndex];
                    GeoDistance.getDistance(WidgetSections.locationData.currentCoordinates, [WidgetSections.selectedItem], '').then(function (result) {
                        if (result.rows.length && result.rows[0].elements.length && result.rows[0].elements[0].distance.text) {
                            WidgetSections.selectedItemDistance = result.rows[0].elements[0].distance.text;
                        } else {
                            WidgetSections.selectedItemDistance = null;
                        }
                    }, function (err) {
                        console.log('distance err', err);
                        WidgetSections.selectedItemDistance = null;
                    });
                };

                var initItems = true;
                $scope.$watch(function () {
                    return WidgetSections.items;
                }, function () {

                    if (initItems) {
                        initItems = false;
                        return;
                    }

                    GeoDistance.getDistance(WidgetSections.locationData.currentCoordinates, WidgetSections.items, WidgetSections.info.data.settings.showDistanceIn).then(function (result) {
                        console.log('distance result', result);

                        for (var _ind = 0; _ind < WidgetSections.items.length; _ind++) {
                            WidgetSections.items[_ind].data.distanceText = (result.rows[0].elements[_ind].status != 'OK') ? 'NA' : result.rows[0].elements[_ind].distance.text;
                            WidgetSections.items[_ind].data.distance = (result.rows[0].elements[_ind].status != 'OK') ? -1 : result.rows[0].elements[_ind].distance.value;
                        }


                    }, function (err) {
                        console.error('distance err', err);
                    });
                });

                //syn with widget side
                Messaging.sendMessageToControl({
                    name: EVENTS.ROUTE_CHANGE,
                    message: {
                        path: PATHS.HOME
                    }
                });

            }]);
})(window.angular, undefined);