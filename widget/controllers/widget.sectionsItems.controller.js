(function (angular, window) {
    angular
        .module('placesWidget')
        .controller('WidgetSectionsItemsCtrl', ['$scope', '$window', 'DB', 'COLLECTIONS', '$rootScope', 'Buildfire', 'AppConfig', 'Messaging', 'EVENTS', 'PATHS', 'Location', 'Orders', 'DEFAULT_VIEWS', 'GeoDistance', '$timeout', 'OrdersItems', '$filter', 'ViewStack',
            function ($scope, $window, DB, COLLECTIONS, $rootScope, Buildfire, AppConfig, Messaging, EVENTS, PATHS, Location, Orders, DEFAULT_VIEWS, GeoDistance, $timeout, OrdersItems, $filter, ViewStack) {
                var WidgetSections = this;
                WidgetSections.removeShowSectionsArea = true;
                var vs = ViewStack.getCurrentView();
                WidgetSections.selectedSection = vs.sectionId;
                if (vs.sectionId) {
                    if (vs.sectionId != 'allitems')
                        WidgetSections.selectedSections = [vs.sectionId];
                    else
                        WidgetSections.selectedSections = [];

                    $timeout(function () {
                        WidgetSections.showBtmMenu = true;
                    }, 1000);
                }

                WidgetSections.showMenu = false;
                WidgetSections.menuTab = 'Category';
                WidgetSections.filterUnapplied = true;
                WidgetSections.showSections = false;
                WidgetSections.onSliderChange = function () {
                    WidgetSections.filterUnapplied = false; // this tells us that the slider has been set by the user
                };

                WidgetSections.showItems = function (id) {
                    WidgetSections.mainViewBtmMenu = false;
                    ViewStack.push({
                        template: "section",
                        sectionId: id
                    });
                };

                WidgetSections.showItemDetails = function (secId, itemId) {
                    console.log('secId,itemId', secId, itemId);
                    ViewStack.push({
                        template: "item",
                        sectionId: secId,
                        itemId: itemId
                    });
                };


                WidgetSections.placesInfo = null;

                if (!vs.currentView)
                    WidgetSections.currentView = null;
                else {
                    WidgetSections.currentView = vs.currentView;
                }

                WidgetSections.selectedItem = null;
                WidgetSections.selectedItemDistance = null;
                WidgetSections.sortOnClosest = false; // default value

                WidgetSections.locationData = {
                    items: null,
                    currentCoordinates: null
                };

                /**
                 * WidgetSections.isBusy checks if items are fetched
                 * @type {boolean}
                 */
                WidgetSections.isBusyItems = false;

                /**
                 * WidgetSections.noMoreItems checks for further data in Items
                 * @type {boolean}
                 */
                WidgetSections.noMoreItems = false;

                WidgetSections.showDescription = function () {
                    console.log('Description------------------------', WidgetSections.placesInfo, WidgetSections.placesInfo.data.content.descriptionHTML);
                    if (WidgetSections.placesInfo.data.content.descriptionHTML == '<p>&nbsp;<br></p>' || WidgetSections.placesInfo.data.content.descriptionHTML == '<p><br data-mce-bogus="1"></p>' || WidgetSections.placesInfo.data.content.descriptionHTML == "")
                        return false;
                    else
                        return true;
                };
                /**
                 * loadMoreItems method loads the sections in list page.
                 */
                WidgetSections.loadMoreItems = function () {
                    if (WidgetSections.placesInfo == null || WidgetSections.noMoreItems || WidgetSections.isBusyItems) {
                        console.log('but no more items');
                        return;
                    }

                    updateGetOptionsItems();

                    WidgetSections.isBusyItems = true;
                    Items.find(searchOptionsItems).then(function success(result) {
                        WidgetSections.isBusyItems = false;
                        if (result.length <= _limit) {// to indicate there are more
                            //alert('full');
                            WidgetSections.noMoreItems = true;
                        }
                        else {
                            result.pop();
                            searchOptionsItems.skip = searchOptions.skip + _limit;
                            WidgetSections.noMoreItems = false;
                        }

                        if (result.length) {
                            result.forEach(function (_item) {
                                _item.data.distance = 0; // default distance value
                                _item.data.distanceText = (WidgetSections.locationData.currentCoordinates) ? 'Fetching..' : 'NA';
                            });
                        }

                        var items = WidgetSections.locationData.items ? WidgetSections.locationData.items.concat(result) : result;
                        WidgetSections.locationData.items = $filter('unique')(items, 'id');
                    }, function fail() {
                        WidgetSections.isBusyItems = false;
                        console.error('error in item fetch');
                    });
                };

                var _skip = 0,
                    _skipItems = 0,
                    view = null,
                    mapview = null,
                    currentLayout = '',
                    _limit = 10,
                    searchOptions = {
                        //filter: {"$json.secTitle": {"$regex": '/*'}},
                        skip: _skip,
                        limit: _limit + 1 // the plus one is to check if there are any more
                    }
                    , searchOptionsItems = {
                        filter: {"$json.itemTitle": {"$regex": '/*'}},
                        skip: _skipItems,
                        limit: _limit + 1 // the plus one is to check if there are any more
                    }
                    , _placesInfoData = {
                        data: {
                            content: {
                                images: [],
                                descriptionHTML: '<p>&nbsp;<br></p>',
                                description: '<p>&nbsp;<br></p>',
                                sortBy: Orders.ordersMap.Manually,
                                rankOfLastItem: '',
                                sortByItems: OrdersItems.ordersMap.Newest,
                                showAllItems: 'true',
                                allItemImage: ''
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
                                showDistanceIn: "mi"
                            }
                        }
                    };

                /*declare the device width heights*/
                $rootScope.deviceHeight = window.innerHeight;
                $rootScope.deviceWidth = window.innerWidth;

                /*initialize the device width heights*/
                var initDeviceSize = function (callback) {
                    WidgetSections.deviceHeight = window.innerHeight;
                    WidgetSections.deviceWidth = window.innerWidth;
                    if (callback) {
                        if (WidgetSections.deviceWidth == 0 || WidgetSections.deviceHeight == 0) {
                            setTimeout(function () {
                                initDeviceSize(callback);
                            }, 500);
                        } else {
                            callback();
                            if (!$scope.$$phase && !$scope.$root.$$phase) {
                                $scope.$apply();
                            }
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


                if (vs.sectionId != 'allitems') {
                    Sections.getById(vs.sectionId).then(function (d) {
                        console.log('secListBGImage', d);
                        if (d)
                            WidgetSections.secListBGImage = d.data.itemListBGImage;
                        else
                            WidgetSections.secListBGImage = null;
                    }, function () {
                        WidgetSections.secListBGImage = null;
                    });
                }


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

                /**
                 * updateGetOptionsItems method checks whether sort options changed or not.
                 * @returns {boolean}
                 */
                var updateGetOptionsItems = function () {
                    var _sortBy = (WidgetSections.placesInfo && WidgetSections.placesInfo.data && WidgetSections.placesInfo.data.content) ? WidgetSections.placesInfo.data.content.sortByItems : Orders.ordersMap.Default;
                    console.log('items order sortby', _sortBy);
                    var order = OrdersItems.getOrder(_sortBy);
                    console.log('items order', order);
                    if (order) {
                        var sort = {};
                        sort[order.key] = order.order;
                        searchOptionsItems.sort = sort;
                        return true;
                    }
                    else {
                        return false;
                    }
                };

                var refreshItems = function () {
                    searchOptionsItems.skip = 0;
                    WidgetSections.noMoreItems = false;
                    WidgetSections.isBusyItems = false;
                    if (WidgetSections.locationData.items) {
                        WidgetSections.locationData.items = [];
                    }

                };

                var loadAllItemsOfSections = function () {
                    var itemFilter = {"$json.itemTitle": {"$regex": '/*'}};
                    searchOptionsItems.filter = itemFilter;
                    refreshItems();
                };

                var initMapCarousel = function () {
                    if (WidgetSections.selectedItem && WidgetSections.selectedItem.data && WidgetSections.selectedItem.data.images) {
                        loadMapCarouselItems(WidgetSections.selectedItem.data.images);
                    }
                    else {
                        loadMapCarouselItems([]);
                    }
                };

                /**
                 * Buildfire.datastore.onUpdate method calls when Data is changed.
                 */
                var clearOnUpdateListener = Buildfire.datastore.onUpdate(function (event) {
                    console.log('Event in ------------------', event);
                    if (event.tag === "placeInfo") {
                        console.log('update happened in placeInfo');

                        if (event.data) {

                            if (WidgetSections.placesInfo && WidgetSections.placesInfo.data && WidgetSections.placesInfo.data.settings) {
                                if (event.data.settings.showDistanceIn != WidgetSections.placesInfo.data.settings.showDistanceIn)
                                    $window.location.reload();

                                var sortByItemsChange = false;
                                if (event.data.content.sortByItems != WidgetSections.placesInfo.data.content.sortByItems)
                                    sortByItemsChange = true;
                            }
                            WidgetSections.placesInfo = event;

                            if (sortByItemsChange)
                                filterChanged();

                            WidgetSections.selectedItem = null;
                            WidgetSections.selectedItemDistance = null;

                            //if (WidgetSections.currentView == null)
                            WidgetSections.currentView = WidgetSections.placesInfo.data.settings.defaultView;

                            if (!$scope.$$phase)$scope.$digest();
                            refreshSections();


                            $timeout(function () {
                                var carousel = $("#carousel").html();
                                // set carousel in case of design layout change

                                // $("#carousel").length checks if element is there on the page
                                if ($("#carousel").length > 0 && carousel.trim() == '') {
                                    view = new Buildfire.components.carousel.view("#carousel", []); ///create new instance of buildfire carousel viewer
                                }
                                if (view) {
                                    view.loadItems(event.data.content.images);
                                }
                            }, 1500);
                        }
                    }
                    else if (event.tag === "items") {
                        if (event.data) {
                            $timeout(function () {
                                filterChanged();
                            }, 1500);
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
                            if (!$scope.$$phase)$scope.$digest();
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

                $scope.distanceSlider = {
                    min: 0,
                    max: 300,
                    ceil: 310, //upper limit
                    floor: 0
                };

                function initPage() {
                    if (WidgetSections.placesInfo.data.settings && WidgetSections.placesInfo.data.settings.showDistanceIn == 'mi')
                        $scope.distanceSlider = {
                            min: 0,
                            max: 300,
                            ceil: 310, //upper limit
                            floor: 0
                        };
                    else
                        $scope.distanceSlider = {
                            min: 0,
                            max: 483,
                            ceil: 499, //upper limit
                            floor: 0
                        };

                    if (WidgetSections.currentView == null)
                        WidgetSections.currentView = (WidgetSections.placesInfo && WidgetSections.placesInfo.data && WidgetSections.placesInfo.data.settings) ? WidgetSections.placesInfo.data.settings.defaultView : null;
                    if (WidgetSections.currentView) {
                        switch (WidgetSections.currentView) {
                            case DEFAULT_VIEWS.LIST:
                                currentLayout = WidgetSections.placesInfo && WidgetSections.placesInfo.data && WidgetSections.placesInfo.data.design && WidgetSections.placesInfo.data.design.secListLayout;
                                break;
                            case DEFAULT_VIEWS.MAP:
                                currentLayout = WidgetSections.placesInfo && WidgetSections.placesInfo.data && WidgetSections.placesInfo.data.design && WidgetSections.placesInfo.data.design.mapLayout;
                                break;
                        }
                    }
                    WidgetSections.loadMoreItems();
                }

                (function () {


                    PlaceInfo.get().then(function (data) {
                        WidgetSections.placesInfo = data;
                        initPage();
                    }, function () {
                        WidgetSections.placesInfo = _placesInfoData;
                        initPage();
                    });


                })();


                if (typeof(Storage) !== "undefined") {
                    var userLocation = localStorage.getItem('user_location');
                    if (userLocation) {
                        //WidgetSections.sortOnClosest = true;// will be true if user allows location
                        WidgetSections.locationData.currentCoordinates = JSON.parse(userLocation);
                    }
                    else
                        getGeoLocation(); // get data if not in cache
                }
                else {
                    getGeoLocation(); // get data if localStorage is not supported
                }


                function getGeoLocation() {
                    Buildfire.geo.getCurrentPosition(
                        null,
                        function (err, position) {
                            if (err) {

                                console.error(err);
                            }
                            else {

                                $scope.$apply(function () {

                                    console.log('position>>>>>.', position);
                                    //WidgetSections.sortOnClosest = true;// will be true if user allows location
                                    WidgetSections.locationData.currentCoordinates = [position.coords.longitude, position.coords.latitude];
                                    localStorage.setItem('user_location', JSON.stringify(WidgetSections.locationData.currentCoordinates));
                                });
                            }
                        }
                    );
                }

                /// load items
                function loadItems(carouselItems) {
                    // create an instance and pass it the items if you don't have items yet just pass []
                    if (view)
                        view.loadItems(carouselItems);
                    else
                        alert('no view');
                }

                /// load items
                function loadMapCarouselItems(carouselItems) {
                    $timeout(function () {
                        if (!mapview || angular.element("#mapCarousel").hasClass('plugin-slider') == false) {
                            mapview = new Buildfire.components.carousel.view("#mapCarousel", []);  ///create new instance of buildfire carousel viewer
                        }

                        // create an instance and pass it the items if you don't have items yet just pass []
                        if (mapview)
                            mapview.loadItems(carouselItems);
                    }, 1500);


                }

                function getItemsDistance(_items) {
                    console.log('WidgetSections.locationData.items', _items);
                    if (WidgetSections.locationData.currentCoordinates == null) {
                        return;
                    }
                    if (_items && _items.length) {
                        GeoDistance.getDistance(WidgetSections.locationData.currentCoordinates, _items, WidgetSections.placesInfo.data.settings.showDistanceIn).then(function (result) {
                            console.log('distance result', result);
                            for (var _ind = 0; _ind < WidgetSections.locationData.items.length; _ind++) {
                                if (_items && _items[_ind]) {
                                    _items[_ind].data.distanceText = (result.rows[0].elements[_ind].status != 'OK') ? 'NA' : result.rows[0].elements[_ind].distance.text;
                                    _items[_ind].data.distance = (result.rows[0].elements[_ind].status != 'OK') ? -1 : result.rows[0].elements[_ind].distance.value;
                                }
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
                    if (!$scope.$$phase)$scope.$digest();
                }

                function filterChanged() {
                    console.log('filter changed fired');
                    var itemFilter;
                    WidgetSections.selectedItem = null;
                    if (WidgetSections.selectedSections.length) {
                        // filter applied
                        itemFilter = {'$json.sections': {'$in': WidgetSections.selectedSections}};
                    }
                    else {
                        // all items selected
                        itemFilter = {"$json.itemTitle": {"$regex": '/*'}};
                    }
                    searchOptionsItems.filter = itemFilter;
                    refreshItems();
                    WidgetSections.loadMoreItems();
                }

                WidgetSections.itemsOrder = function (item) {
                    if (WidgetSections.sortOnClosest)
                        return item.data.distance;
                    else {
                        var order = OrdersItems.getOrder(WidgetSections.placesInfo.data.content.sortByItems || OrdersItems.ordersMap.Default);
                        if (order.order == 1)
                            return item.data[order.key];
                        else
                            return item.data['-' + order.key];
                    }
                };

                /* Onclick event of items on the map view*/
                WidgetSections.selectedMarker = function (itemIndex) {
                    if (itemIndex === null) {
                        WidgetSections.selectedItem = null;
                        $scope.$digest();
                        return;
                    }
                    WidgetSections.selectedItem = WidgetSections.locationData.items[itemIndex];

                    GeoDistance.getDistance(WidgetSections.locationData.currentCoordinates, [WidgetSections.selectedItem], '').then(function (result) {
                        console.log('Distance---------------------', result);
                        if (result.rows.length && result.rows[0].elements.length && result.rows[0].elements[0].distance && result.rows[0].elements[0].distance.text) {
                            WidgetSections.selectedItemDistance = result.rows[0].elements[0].distance.text;
                        } else {
                            WidgetSections.selectedItemDistance = null;
                        }
                    }, function (err) {
                        WidgetSections.selectedItemDistance = null;
                    });
                    initMapCarousel();
                };

                /* Filters the items based on the range of distance slider */
                WidgetSections.sortFilter = function (item) {

                    if (WidgetSections.filterUnapplied || WidgetSections.locationData.currentCoordinates == null || !item.data.distanceText || item.data.distanceText == 'Fetching..' || item.data.distanceText == 'NA') {
                        return true;
                    }
                    var sortFilterCond;
                    try {
                        sortFilterCond = (Number(item.data.distanceText.split(' ')[0]) >= $scope.distanceSlider.min && Number(item.data.distanceText.split(' ')[0]) <= $scope.distanceSlider.max);
                    }
                    catch (e) {
                        sortFilterCond = true;
                    }
                    return sortFilterCond;
                };


                /**
                 * WidgetSections.sections holds the array of items.
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
                    if (WidgetSections.noMoreSections) {
                        console.log('fetch sections cancelled bcs all loaded up');
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

                WidgetSections.toggleSectionSelection = function (ind) {
                    WidgetSections.showSections = false;
                    var id = WidgetSections.sections[ind].id;
                    if (WidgetSections.selectedSections.indexOf(id) < 0) {
                        WidgetSections.selectedSections.push(id);
                    }
                    else {
                        WidgetSections.selectedSections.splice(WidgetSections.selectedSections.indexOf(id), 1);
                        if (!WidgetSections.showSections && WidgetSections.selectedSections.length == 0) {
                            //WidgetSections.showSections = true;
                        }
                    }
                };

                WidgetSections.resetSectionFilter = function () {
                    if (!WidgetSections.showSections && WidgetSections.selectedSections.length == 0) {
                        return;
                    }
                    WidgetSections.showSections = false;
                    refreshItems();
                    WidgetSections.selectedSections = [];
                    filterChanged();
                };

                WidgetSections.openInMap = function () {
                    if (buildfire.context.device && buildfire.context.device.platform == 'ios')
                        window.open("maps://maps.google.com/maps?daddr=" + WidgetSections.selectedItem.data.address.lng + "," + WidgetSections.selectedItem.data.address.lat);
                    else
                        window.open("http://maps.google.com/maps?daddr=" + WidgetSections.selectedItem.data.address.lng + "," + WidgetSections.selectedItem.data.address.lat);

                };

                WidgetSections.refreshLocation = function () {
                    getGeoLocation();
                };


                /*document.addEventListener("deviceready", );
                 $scope.$on('$viewContentLoaded', function () {
                 getGeoLocation()
                 });*/
                $scope.$watch(function () {
                    return WidgetSections.locationData.items;
                }, getItemsDistance);

                $scope.$watch(function () {
                    return WidgetSections.selectedSections;
                }, filterChanged, true);

                $scope.$watch(function () {
                    return WidgetSections.currentView;
                }, function () {
                    WidgetSections.refreshLocation();
                    WidgetSections.selectedItem = null;
                }, true);


                /*WidgetSections.getSectionId = function (arr) {
                 if (arr.length == 0 || angular.element("#allItemsOption").hasClass('whiteTheme') || angular.element('.list-item.section-filter.whiteTheme').length == 0)
                 return 'allitems';
                 else {
                 if (angular.element('.list-item.section-filter.whiteTheme').length == 1 && angular.element("#allItemsOption").hasClass('whiteTheme') == false)
                 return $('.list-item.section-filter.whiteTheme').attr('section-id');
                 else
                 return arr[0];
                 }
                 };

                 $scope.$on("Map Carousel:LOADED", function () {
                 /!*if (!mapview) {
                 mapview = new Buildfire.components.carousel.view("#mapCarousel", []);  ///create new instance of buildfire carousel viewer
                 }*!/
                 });
                 */

                /**
                 * will called when controller scope has been destroyed.
                 */
                $scope.$on("$destroy", function () {
                    clearOnUpdateListener.clear();
                    //offCallMeFn();
                });
                $rootScope.$on(EVENTS.ITEM_UPDATED, function (e, event) {
                    WidgetSections.locationData.items.some(function(item, index) {
                        if(item.id == event.id) {
                            WidgetSections.locationData.items[index].data = event.data;
                            if (!$scope.$$phase)$scope.$digest();
                            return true;
                        }
                    })
                });
            }
        ])
    ;
})(window.angular, window);