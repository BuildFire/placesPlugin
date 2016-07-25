(function (angular, window) {
    angular
        .module('placesWidget')
        .controller('WidgetSectionsCtrl', ['$scope', '$window', 'DB', 'COLLECTIONS', '$rootScope', 'Buildfire', 'AppConfig', 'Messaging', 'EVENTS', 'PATHS', 'Location', 'Orders', 'DEFAULT_VIEWS', 'GeoDistance', '$timeout', 'OrdersItems', '$filter', 'ViewStack',
            function ($scope, $window, DB, COLLECTIONS, $rootScope, Buildfire, AppConfig, Messaging, EVENTS, PATHS, Location, Orders, DEFAULT_VIEWS, GeoDistance, $timeout, OrdersItems, $filter, ViewStack) {
                var WidgetSections = this;
                WidgetSections.removeShowSectionsArea = false;
                WidgetSections.showMenu = false;
                WidgetSections.menuTab = 'Category';
                WidgetSections.filterUnapplied = true;
                //WidgetSections.mainViewBtmMenu = true;
                WidgetSections.selectedSections = [];

                WidgetSections.onSliderChange = function () {
                    WidgetSections.filterUnapplied = false; // this tells us that the slider has been set by the user
                };

                WidgetSections.showItems = function (id) {
                    WidgetSections.mainViewBtmMenu = false;
                    ViewStack.push({
                        template: "section",
                        sectionId: id,
                        currentView: WidgetSections.currentView
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


                WidgetSections.showSections = true;

                var vs = ViewStack.getCurrentView();
                console.log('>>>>vs<<<<', vs);


//                WidgetSections.selectedSections = [];
                WidgetSections.showBtmMenu = true;


                WidgetSections.placesInfo = null;
                WidgetSections.currentView = null;
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
                    if (WidgetSections.placesInfo && WidgetSections.placesInfo.data && WidgetSections.placesInfo.data.content && WidgetSections.placesInfo.data.content.descriptionHTML != '<p>&nbsp;<br></p>' && WidgetSections.placesInfo.data.content.descriptionHTML != '<p><br data-mce-bogus="1"></p>' && WidgetSections.placesInfo.data.content.descriptionHTML != "")
                        return true;
                    else
                        return false;
                };
                /**
                 * loadMoreItems method loads the sections in list page.
                 */
                WidgetSections.loadMoreItems = function () {
                    if (WidgetSections.noMoreItems || WidgetSections.isBusyItems) {
                        console.log('but no more items');
                        return;
                    }
                    console.log('items load called', mapview);
                    updateGetOptionsItems();
                    WidgetSections.isBusyItems = true;
                    Items.find(searchOptionsItems).then(function success(result) {
                        WidgetSections.isBusyItems = false;
                        if (result.length <= _limit) {// to indicate there are more
                            //alert('full');
                            WidgetSections.noMoreItems = true;
                        }
                        else if(searchOptionsItems && searchOptionsItems.limit) {
                            result.pop();
//                            searchOptionsItems.skip = searchOptions.skip + _limit;
                            WidgetSections.noMoreItems = false;
                            _skipItems = result.length;
                        }

                        if (result.length) {
                            result.forEach(function (_item) {
                                _item.data.distance = 0; // default distance value
                                _item.data.distanceText = (WidgetSections.locationData && WidgetSections.locationData.currentCoordinates) ? 'Fetching..' : 'NA';
                            });
                        }

                        console.log('result', result);
                        var items = WidgetSections.locationData && WidgetSections.locationData.items ? WidgetSections.locationData.items.concat(result) : result;
                        WidgetSections.locationData.items = $filter('unique')(items, 'id');
                        _skipItems = WidgetSections.locationData && WidgetSections.locationData.items && WidgetSections.locationData.items.length;
                        searchOptionsItems.skip = _skipItems;
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
                        limit: _limit + 1
                    }
                    , _placesInfoData = {
                        data: {
                            content: {
                                images: [],
                                descriptionHTML: '<p>&nbsp;<br></p>',
                                description: '<p>&nbsp;<br></p>',
                                sortBy: Orders.ordersMap && Orders.ordersMap.Manually,
                                rankOfLastItem: '',
                                sortByItems: OrdersItems.ordersMap && OrdersItems.ordersMap.Newest,
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
                $rootScope.deviceWidth = window.innerWidth || 320;

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
                    var _sortBy = (WidgetSections.placesInfo && WidgetSections.placesInfo.data) ? WidgetSections.placesInfo.data.content.sortByItems : Orders.ordersMap.Default;
                    var order = Orders.getOrder(_sortBy);
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

                var initCarousel = function (_defaultView) {
                    console.log('akh', WidgetSections.placesInfo);
                    if (currentLayout == '' || currentLayout == null || currentLayout.indexOf('list') != -1) {

                        if (WidgetSections.placesInfo && WidgetSections.placesInfo.data && WidgetSections.placesInfo.data.content && WidgetSections.placesInfo.data.content.images && WidgetSections.placesInfo.data.content.images.length) {
                            loadItems(WidgetSections.placesInfo.data.content.images);
                        } else {
                            loadItems([]);
                        }
                    } else {

                        if (WidgetSections.placesInfo && WidgetSections.placesInfo.data && WidgetSections.placesInfo.data.content && WidgetSections.placesInfo.data.content.images && WidgetSections.placesInfo.data.content.images.length) {
                            loadItems(WidgetSections.placesInfo.data.content.images);
                        } else {
                            loadItems([]);
                        }

                        if (WidgetSections.selectedItem && WidgetSections.selectedItem.data && WidgetSections.selectedItem.data.images && WidgetSections.selectedItem.data.images.length) {
                            loadMapCarouselItems(WidgetSections.selectedItem.data.images);
                        } else {
                            loadMapCarouselItems([]);
                        }

                    }

                };

                /**
                 * Buildfire.datastore.onUpdate method calls when Data is changed.
                 */
                var clearOnUpdateListener;

                WidgetSections.applyOnUpdateWatcher = function () {
                    clearOnUpdateListener = Buildfire.datastore.onUpdate(function (event) {
                        console.log('Event in ------------------', event);
                        if (event.tag === "placeInfo") {
                            console.log('update happened in placeInfo');

                            if (event.data) {

                                if (WidgetSections.placesInfo && WidgetSections.placesInfo.data && WidgetSections.placesInfo.data.settings) {
                                    if (event.data.settings.showDistanceIn != WidgetSections.placesInfo.data.settings.showDistanceIn)
                                        $window.location.reload();

                                    var sortByItemsChange = false;
                                    if (WidgetSections.placesInfo.data.content && event.data.content && event.data.content.sortByItems != WidgetSections.placesInfo.data.content.sortByItems)
                                        sortByItemsChange = true;
                                }
                                WidgetSections.placesInfo = event;

                                if (sortByItemsChange)
                                    filterChanged();

                                WidgetSections.selectedItem = null;
                                WidgetSections.selectedItemDistance = null;
                                WidgetSections.currentView = WidgetSections.placesInfo && WidgetSections.placesInfo.data && WidgetSections.placesInfo.data.settings && WidgetSections.placesInfo.data.settings.defaultView;
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
                }

                WidgetSections.applyOnUpdateWatcher();

                Buildfire.datastore.onRefresh(function(){
                    Location.goToHome();
                });

                $scope.distanceSlider = {
                    min: 0,
                    max: 300,
                    ceil: 310, //upper limit
                    floor: 0
                };

                function initPage() {
                    if (WidgetSections.placesInfo.data.settings && WidgetSections.placesInfo.data.settings.showDistanceIn == 'mi') {
                        $scope.distanceSlider = {
                            min: 0,
                            max: 300,
                            ceil: 310, //upper limit
                            floor: 0
                        };
                    }
                    else {
                        $scope.distanceSlider = {
                            min: 0,
                            max: 483,
                            ceil: 499, //upper limit
                            floor: 0
                        };
                    }
                    WidgetSections.currentView = (WidgetSections.placesInfo && WidgetSections.placesInfo.data && WidgetSections.placesInfo.data.settings) ? WidgetSections.placesInfo.data.settings.defaultView : 'list';
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
//                    loadAllItemsOfSections();
                }

                function initPlaces() {
                    PlaceInfo.get().then(function (data) {
                        if (data && data.id)
                            WidgetSections.placesInfo = data;
                        else
                            WidgetSections.placesInfo = _placesInfoData;
                        initPage();
                    }, function () {
                        WidgetSections.placesInfo = _placesInfoData;
                        initPage();
                    });
                }
                (function () {
                    initPlaces();
                })();


                if (typeof(Storage) !== "undefined") {
                    var userLocation = localStorage.getItem('user_location');
                    if (userLocation) {
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
                            else if(position && position.coords){

                                $scope.$apply(function () {

                                    console.log('position>>>>>.', position);
                                    //WidgetSections.sortOnClosest = true;// will be true if user allows location
                                    WidgetSections.locationData.currentCoordinates = [position.coords.longitude, position.coords.latitude];
                                    localStorage.setItem('user_location', JSON.stringify(WidgetSections.locationData.currentCoordinates));
                                });
                            }
                            else{
                                getGeoLocation();
                            }
                        }
                    );
                }

                /// load items
                function loadItems(carouselItems) {
                    // create an instance and pass it the items if you don't have items yet just pass []
                    var carousel = $("#carousel").html();
                    // set carousel in case of design layout change

                    // $("#carousel").length checks if element is there on the page
                    if ($("#carousel").length > 0 && carousel.trim() == '') {
                        view = new Buildfire.components.carousel.view("#carousel", []); ///create new instance of buildfire carousel viewer
                    }
                    if (view) {
                        view.loadItems(carouselItems);
                    }
                    else {
                        view = new Buildfire.components.carousel.view("#carousel", carouselItems);
                    }
                }

                /// load items
                function loadMapCarouselItems(carouselItems) {
                    $timeout(function () {
                        if(angular.element('#mapCarousel1').length) {
                            mapview = null;
                            angular.element("#mapCarousel1").replaceWith('<div id="mapCarousel" map-build-fire-carousel="" class="plugin-slider"></div>');
                        }

                        if (angular.element("#mapCarousel").length && (!mapview || angular.element("#mapCarousel").hasClass('plugin-slider') == false)) {
                            mapview = new Buildfire.components.carousel.view("#mapCarousel", []);  ///create new instance of buildfire carousel viewer
                        }
                        if(angular.element("#mapCarousel").length)
                            mapview.loadItems(carouselItems);
                        // create an instance and pass it the items if you don't have items yet just pass []
                    }, 150);
                }

                function getItemsDistance(_items) {
                    console.log('WidgetSections.locationData.items', _items);
                    if (WidgetSections.locationData && WidgetSections.locationData.currentCoordinates == null) {
                        return;
                    }
                    if (_items && _items.length) {
                        var distanceIn = (WidgetSections.placesInfo && WidgetSections.placesInfo.data && WidgetSections.placesInfo.data.settings && WidgetSections.placesInfo.data.settings.showDistanceIn) || 'mi';
                        GeoDistance.getDistance(WidgetSections.locationData.currentCoordinates, _items, distanceIn).then(function (result) {
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
                    searchOptions.skip=0;
                    WidgetSections.noMoreSections = false;
                    WidgetSections.loadMoreSections();
                    if (!$scope.$$phase)$scope.$digest();
                }

                function filterChanged() {
                    console.log('filter changed fired');
                    var itemFilter;
                    WidgetSections.selectedItem = null;
                    if (WidgetSections.selectedSections && WidgetSections.selectedSections.length) {
                        // filter applied
                        itemFilter = {'$json.sections': {'$in': WidgetSections.selectedSections}};
                        searchOptionsItems.limit = _limit + 1;
                    }
                    else if (WidgetSections.selectedSections) {
                        // all items selected
                        itemFilter = {"$json.itemTitle": {"$regex": '/*'}};
                        if(searchOptionsItems.limit){
                            delete searchOptionsItems.limit;
                        }
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
                    initCarousel(WidgetSections.placesInfo.data.settings.defaultView);

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
                        else if(searchOptions && searchOptions.limit) {
                            result.pop();
//                            searchOptions.skip = searchOptions.skip + _limit;
                            WidgetSections.noMoreSections = false;
                            // _skip = result.length;
                        }

                        var sections = WidgetSections.sections ? WidgetSections.sections.concat(result) : result;
                        WidgetSections.sections = $filter('unique')(sections, 'id');
                        _skip = WidgetSections.sections && WidgetSections.sections.length;
                        searchOptions.skip = _skip;
                        WidgetSections.isBusy = false;
                    }, function fail() {
                        WidgetSections.isBusy = false;
                        console.error('error');
                    });
                };

                WidgetSections.toggleSectionSelection = function (ind) {
                    WidgetSections.showSections = false;
                    var id = WidgetSections.sections[ind].id;
                    if (WidgetSections.selectedSections && WidgetSections.selectedSections.indexOf(id) < 0) {
                        WidgetSections.selectedSections.push(id);
                    }
                    else if (WidgetSections.selectedSections) {
                        WidgetSections.selectedSections.splice(WidgetSections.selectedSections.indexOf(id), 1);
                        if (!WidgetSections.showSections && WidgetSections.selectedSections.length == 0) {
                            WidgetSections.showSections = true;
                        }
                    }
                };

                WidgetSections.resetSectionFilter = function () {
                    if (!WidgetSections.showSections && WidgetSections.selectedSections && WidgetSections.selectedSections.length == 0) {
                        WidgetSections.showSections = true;
                        return;
                    }
                    WidgetSections.showSections = false;
                    refreshItems();
                    WidgetSections.selectedSections = [];
                    filterChanged();
                };

                WidgetSections.openInMap = function () {
                    console.log('openInMap-------------------------method called------------', WidgetSections.selectedItem);
                    if (buildfire.context.device && buildfire.context.device.platform == 'ios')
                        Buildfire.navigation.openWindow("maps://maps.google.com/maps?daddr=" + WidgetSections.selectedItem.data.address.lat + "," + WidgetSections.selectedItem.data.address.lng, '_system');
                    else
                        Buildfire.navigation.openWindow("http://maps.google.com/maps?daddr=" + WidgetSections.selectedItem.data.address.lat + "," + WidgetSections.selectedItem.data.address.lng, '_system');
                };

                WidgetSections.refreshLocation = function () {
                    getGeoLocation();
                };


                $scope.$watch(function () {
                    return WidgetSections.locationData.items;
                }, getItemsDistance);

                $scope.$watch(function () {
                    return WidgetSections.selectedSections;
                }, filterChanged, true);

                $scope.$watch(function () {
                    return WidgetSections.currentView;
                }, function (view) {
                    WidgetSections.refreshLocation();
                    currentLayout = view;
                    WidgetSections.selectedItem = null;
                }, true);

                $scope.$on("Carousel:LOADED", function () {
                    $timeout(function () {
                        if (!view)
                            view = new Buildfire.components.carousel.view("#carousel", []);  ///create new instance of buildfire carousel viewer

                        if (WidgetSections.placesInfo && WidgetSections.placesInfo.data && WidgetSections.placesInfo.data.settings.defaultView)
                            initCarousel(WidgetSections.placesInfo.data.settings.defaultView);
                        else
                            view.loadItems([]);
                    }, 10);
                });


                Messaging.onReceivedMessage = function (event) {
                    console.log('OMMMMM Messaging.onReceivedMessage----------------------Widget Side?????????????????????????????????-------', event);
                    if (event) {
                        switch (event.name) {

                            case EVENTS.ROUTE_CHANGE:
                                var path = event.message.path,
                                    id = event.message.id,
                                    secId = event.message.secId;
                                var currentView = ViewStack.getCurrentView();
                                if (id && currentView.itemId) {
                                    if (currentView.sectionId == secId && currentView.itemId == id && currentView.template == path)
                                        break;
                                }
                                else {
                                    if (!currentView.itemId && currentView.sectionId == secId && currentView.template == path)
                                        break;
                                }

                                console.log('CUREEEEEEEEEEEEEEEEEEEEEEEEEEENTTTTTTTTTTTTTTT VIEWWWWWWWWWWWWWWWWW------------', currentView);
                                switch (path) {
                                    case PATHS.ITEM:
                                        ViewStack.push({
                                            template: "item",
                                            sectionId: secId,
                                            itemId: id,
                                            dontPropagate: true
                                        });
                                        break;
                                    case PATHS.HOME:
                                        ViewStack.popAllViews();
                                        //applyOnUpdateWatcher();
                                        break;
                                    case PATHS.SECTION:
                                        ViewStack.push({
                                            template: "section",
                                            sectionId: secId,
                                            dontPropagate: true
                                        });
                                    default :
                                        break;
                                }
                                $scope.$apply();

                                break;
                        }
                    }
                };

                WidgetSections.reloadPlacesInfo = function () {
                    PlaceInfo.get().then(function (data) {

                        if (data.id)
                            WidgetSections.placesInfo = data;
                        else
                            WidgetSections.placesInfo = _placesInfoData;
                        currentLayout = WidgetSections.currentView = (WidgetSections.placesInfo && WidgetSections.placesInfo.data && WidgetSections.placesInfo.data.settings) ? WidgetSections.placesInfo.data.settings.defaultView : 'list';
                        console.log('WidgetSections.placesInfo>>>>',WidgetSections.placesInfo);
                        if (!view) {
                            $("#carousel").parent().html("<div id='carousel'></div>");
                            view = new Buildfire.components.carousel.view("#carousel", []);  ///create new instance of buildfire carousel viewer
                        }
                        if (view && WidgetSections.placesInfo && WidgetSections.placesInfo.data && WidgetSections.placesInfo.data.settings && WidgetSections.placesInfo.data.settings.defaultView) {
                            initCarousel(WidgetSections.placesInfo.data.settings.defaultView)
                        }
                        else {
                            view.loadItems([]);
                        }

                    }, function () {
                        WidgetSections.placesInfo = _placesInfoData;
                        if (!view) {
                            view = new Buildfire.components.carousel.view("#carousel", []);  ///create new instance of buildfire carousel viewer
                        }
                        view.loadItems([]);
                    });


                };

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
