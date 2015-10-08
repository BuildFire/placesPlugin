(function (angular) {
    angular
        .module('placesWidget')
        .controller('WidgetSectionsCtrl', ['$scope', '$window', 'DB', 'COLLECTIONS', '$rootScope', 'Buildfire', 'AppConfig', 'Messaging', 'EVENTS', 'PATHS', 'Location', 'Orders', 'DEFAULT_VIEWS', 'GeoDistance', '$routeParams', '$timeout', 'placesInfo',
            function ($scope, $window, DB, COLLECTIONS, $rootScope, Buildfire, AppConfig, Messaging, EVENTS, PATHS, Location, Orders, DEFAULT_VIEWS, GeoDistance, $routeParams, $timeout, placesInfo) {

                AppConfig.changeBackgroundTheme();
                var WidgetSections = this;
                WidgetSections.sectionId = $routeParams.sectionId;
                WidgetSections.showMenu = false;
                WidgetSections.menuTab = 'Category';
                WidgetSections.selectedSections = [];
                WidgetSections.showSections = true;
                WidgetSections.placesInfo = null;
                WidgetSections.currentView = null;
                WidgetSections.items = null;
                WidgetSections.selectedItem = null;
                WidgetSections.selectedItemDistance = null;
                WidgetSections.sortOnClosest = false; // default value
                //console.log('Widget Section Ctrl Loaded', WidgetSections.placesInfo);
                WidgetSections.locationData = {
                    items: null,
                    //currentCoordinates: [-117.1920427, 32.7708401] // default san diego
                    currentCoordinates: null
                };

                var _skip = 0,
                    view = null,
                    currentLayout = '',
                    _limit = 5,
                    searchOptions = {
                        //filter: {"$json.secTitle": {"$regex": '/*'}},
                        skip: _skip,
                        limit: _limit + 1 // the plus one is to check if there are any more
                    }
                    , _placesInfoData = {
                        data: {
                            content: {
                                images: [],
                                descriptionHTML: '<p>&nbsp;<br></p>',
                                description: '<p>&nbsp;<br></p>',
                                sortBy: 'Newest',
                                rankOfLastItem: '',
                                sortByItems: 'Newest'
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
                        }
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
                    var _sortBy = (WidgetSections.placesInfo && WidgetSections.placesInfo.data) ? WidgetSections.placesInfo.data.content.sortBy : Orders.ordersMap.Default;
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

                var initCarousel = function (_defaultView) {
                    switch (_defaultView) {
                        case DEFAULT_VIEWS.LIST:
                            if (currentLayout !== WidgetSections.placesInfo.data.design.secListLayout) {
                                currentLayout = WidgetSections.placesInfo.data.design.secListLayout;
                            }
                            if (WidgetSections.placesInfo && WidgetSections.placesInfo.data.content.images.length) {
                                loadItems(WidgetSections.placesInfo.data.content.images);
                            } else {
                                loadItems([]);
                            }
                            break;
                        case DEFAULT_VIEWS.MAP:
                            if (currentLayout !== WidgetSections.placesInfo.data.design.mapLayout) {
                                currentLayout = WidgetSections.placesInfo.data.design.mapLayout;
                            }
                            if (WidgetSections.selectedItem && WidgetSections.selectedItem.data.images.length) {
                                loadItems(WidgetSections.selectedItem.data.images);
                            } else {
                                loadItems([]);
                            }
                            break;
                    }
                };

                /**
                 * Buildfire.datastore.onUpdate method calls when Data is changed.
                 */
                var clearOnUpdateListener = Buildfire.datastore.onUpdate(function (event) {
                    if (event.tag === "placeInfo") {
                        if (event.data) {
                            if (event.data.design) {
                                AppConfig.changeBackgroundTheme(event.data.design.secListBGImage);
                            }
                            WidgetSections.placesInfo = event;
                            WidgetSections.selectedItem = null;
                            WidgetSections.selectedItemDistance = null;
                            WidgetSections.currentView = WidgetSections.placesInfo.data.settings.defaultView;
                            refreshSections();


                            $timeout(function () {
                                var carousel = $("#carousel");
// set carousel in case of design layout change
                                if (carousel.html() && carousel.html().trim() == '')
                                    view = new Buildfire.components.carousel.view("#carousel", []); ///create new instance of buildfire carousel viewer
                                if (view)
                                    view.loadItems(event.data.content.images);
                            }, 1500);
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
                        WidgetSections.selectedItem = null;
                        WidgetSections.selectedItemDistance = null;
                        currentLayout = '';
                        refreshSections();
                    }
                });

                (function () {
                    if (placesInfo) {
                        WidgetSections.placesInfo = placesInfo;
                    }
                    else {
                        WidgetSections.placesInfo = _placesInfoData;
                    }
                    if (WidgetSections.placesInfo.data.design.secListBGImage) {
                        AppConfig.changeBackgroundTheme(WidgetSections.placesInfo.data.design.secListBGImage);
                    }
                    if (WidgetSections.placesInfo.data.settings.showDistanceIn == 'miles')
                        $scope.distanceSlider = {
                            min: 0,
                            max: 200,
                            ceil: 200, //upper limit
                            floor: 0
                        };
                    else
                        $scope.distanceSlider = {
                            min: 0,
                            max: 320,
                            ceil: 320, //upper limit
                            floor: 0
                        };

                    WidgetSections.currentView = WidgetSections.placesInfo ? WidgetSections.placesInfo.data.settings.defaultView : null;
                    if (WidgetSections.currentView) {
                        switch (WidgetSections.currentView) {
                            case DEFAULT_VIEWS.LIST:
                                currentLayout = WidgetSections.placesInfo.data.design.secListLayout;
                                break;
                            case DEFAULT_VIEWS.MAP:
                                currentLayout = WidgetSections.placesInfo.data.design.mapLayout;
                                break;
                        }
                    }
                    loadAllItemsOfSections();
                })();

                if (typeof(Storage) !== "undefined") {
                    var userLocation = localStorage.getItem('user_location');
                    if (userLocation) {
                        WidgetSections.sortOnClosest = true;// will be true if user allows location
                        WidgetSections.locationData.currentCoordinates = JSON.parse(userLocation);
                    }
                    else
                        getGeoLocation(); // get data if not in cache
                }
                else {
                    getGeoLocation(); // get data if localStorage is not supported
                }

                //syn with widget side
                if ($routeParams.sectionId) {
                    // have to get sections explicitly in item list view
                    Sections.find({}).then(function success(result) {
                        WidgetSections.sections = result;
                        WidgetSections.selectedSections = [$routeParams.sectionId];
                        $timeout(function () {
                            $("a[section-id=" + $routeParams.sectionId + "]").addClass('active');
                        }, 1000);

                    }, function () {

                    });

                    Messaging.sendMessageToControl({
                        name: EVENTS.ROUTE_CHANGE,
                        message: {
                            path: PATHS.SECTION,
                            secId: $routeParams.sectionId
                        }
                    });
                }

                function getGeoLocation() {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            $scope.$apply(function () {
                                WidgetSections.sortOnClosest = true;// will be true if user allows location
                                WidgetSections.locationData.currentCoordinates = [position.coords.longitude, position.coords.latitude];
                                localStorage.setItem('user_location', JSON.stringify(WidgetSections.locationData.currentCoordinates));
                            });
                        });
                    }
                    // else - in this case, default coords will be used
                }

                /// load items
                function loadItems(carouselItems) {
                    // create an instance and pass it the items if you don't have items yet just pass []
                    if (view)
                        view.loadItems(carouselItems);
                }

                function getItemsDistance(_items) {

                    if (WidgetSections.locationData.currentCoordinates == null) {
                        return;
                    }
                    if (_items && _items.length) {
                        GeoDistance.getDistance(WidgetSections.locationData.currentCoordinates, _items, WidgetSections.placesInfo.data.settings.showDistanceIn).then(function (result) {
                            console.log('distance result', result);
                            for (var _ind = 0; _ind < WidgetSections.items.length; _ind++) {
                                _items[_ind].data.distanceText = (result.rows[0].elements[_ind].status != 'OK') ? 'NA' : result.rows[0].elements[_ind].distance.text;
                                _items[_ind].data.distance = (result.rows[0].elements[_ind].status != 'OK') ? -1 : result.rows[0].elements[_ind].distance.value;
                            }


                        }, function (err) {
                            console.error('distance err', err);
                        });
                    }
                }

                function refreshSections() {
                    WidgetSections.sections = [];
                    WidgetSections.noMoreSections = false;
                    WidgetSections.loadMoreSections();
                    $scope.$apply();
                }

                function filterChanged() {
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

                WidgetSections.itemsOrder = function (item) {
                    //console.error(WidgetSections.placesInfo.data.content.sortByItems);
                    if (WidgetSections.sortOnClosest)
                        return item.data.distance;
                    else
                        return item.data.itemTitle;
                };

                WidgetSections.selectedMarker = function (itemIndex) {
                    WidgetSections.selectedItem = WidgetSections.locationData.items[itemIndex];
                    initCarousel(WidgetSections.placesInfo.data.settings.defaultView);
                    GeoDistance.getDistance(WidgetSections.locationData.currentCoordinates, [WidgetSections.selectedItem], '').then(function (result) {
                        if (result.rows.length && result.rows[0].elements.length && result.rows[0].elements[0].distance && result.rows[0].elements[0].distance.text) {
                            WidgetSections.selectedItemDistance = result.rows[0].elements[0].distance.text;
                        } else {
                            WidgetSections.selectedItemDistance = null;
                        }
                    }, function (err) {
                        console.log('distance err', err);
                        WidgetSections.selectedItemDistance = null;
                    });
                };

                WidgetSections.sortFilter = function (item) {

                    if (WidgetSections.locationData.currentCoordinates == null || item.data.distanceText == 'Fetching..') {
                        return true;
                    }
                    //console.log(Number(item.data.distanceText.split(' ')[0]),$scope.distanceSlider);
                    return (Number(item.data.distanceText.split(' ')[0]) >= $scope.distanceSlider.min && Number(item.data.distanceText.split(' ')[0]) <= $scope.distanceSlider.max);
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
                    //alert('widget load more called');
                    if (WidgetSections.isBusy && !WidgetSections.noMoreSections) {
                        return;
                    }
                    //alert(1);
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
                        //alert(WidgetSections.sections.length);
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

                $scope.$watch(function () {
                    return WidgetSections.items;
                }, getItemsDistance);

                $scope.$watch(function () {
                    return WidgetSections.selectedSections;
                }, filterChanged, true);

                $scope.$on("Carousel:LOADED", function () {
                    if (!view) {
                        view = new Buildfire.components.carousel.view("#carousel", []);  ///create new instance of buildfire carousel viewer
                    }
                    if (view && WidgetSections.placesInfo && WidgetSections.placesInfo.data && WidgetSections.placesInfo.data.settings.defaultView) {
                        initCarousel(WidgetSections.placesInfo.data.settings.defaultView)
                    }
                    else {
                        view.loadItems([]);
                    }
                });

                /**
                 * will called when controller scope has been destroyed.
                 */
                $scope.$on("$destroy", function () {
                    clearOnUpdateListener.clear();
                });

            }]);
})(window.angular, undefined);