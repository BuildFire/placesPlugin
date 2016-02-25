(function (angular, window) {
    angular
        .module('placesWidget')
        .controller('WidgetItemCtrl', ['$scope', 'COLLECTIONS', 'DB', '$routeParams', 'Buildfire', '$rootScope', 'GeoDistance', 'Messaging', 'Location', 'EVENTS', 'PATHS', 'AppConfig', 'Orders', 'OrdersItems', '$timeout', 'ViewStack' , function ($scope, COLLECTIONS, DB, $routeParams, Buildfire, $rootScope, GeoDistance, Messaging, Location, EVENTS, PATHS, AppConfig, Orders, OrdersItems, $timeout,ViewStack) {
            var WidgetItem = this
                , PlaceInfo = new DB(COLLECTIONS.PlaceInfo)
                , Items = new DB(COLLECTIONS.Items)
                , itemLat = ''
                , itemLng = ''
                , _infoData = {
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
                }
                , _itemData = {
                    data: {
                        listImage: "",
                        itemTitle: "",
                        images: [],
                        summary: '',
                        bodyContent: '',
                        bodyContentHTML: "",
                        addressTitle: '',
                        sections: [],//array of section id
                        address: {
                            lat: "",
                            lng: "",
                            aName: ""
                        },
                        links: [], //  this will contain action links
                        backgroundImage: ""
                    }
                };

          /*  if (placesInfo) { to be done lakshay
                WidgetItem.placeInfo = placesInfo;
            }
            else {*/
              /*  WidgetItem.placeInfo = _infoData;*/
            //}

            var vs = ViewStack.getCurrentView();

            if (vs.itemId && vs.sectionId) {
                PlaceInfo.get().then(function(info){
                    console.log('Places Info in Item Page--------------------------------',info);
                    if(info)
                    WidgetItem.placeInfo=info;
                    else{
                        WidgetItem.placeInfo=_infoData;
                    }
                },function(err){
                    WidgetItem.placeInfo=_infoData;
                });
                Items.getById(vs.itemId).then(function (d) {
                    if (d)
                        WidgetItem.item = d;
                    else
                        WidgetItem.item = _itemData;
                    initItem();
                }, function () {
                    WidgetItem.item = _itemData;
                    initItem();
                });

            }


            function initItem() {
                if (WidgetItem.item.data) {
                    if (WidgetItem.item.data.images) {
                        $timeout(function () {
                            initCarousel(WidgetItem.item.data.images);
                        }, 1500);

                    }
                    itemLat = (WidgetItem.item.data.address && WidgetItem.item.data.address.lat) ? WidgetItem.item.data.address.lat : null;
                    itemLng = (WidgetItem.item.data.address && WidgetItem.item.data.address.lng) ? WidgetItem.item.data.address.lng : null;
                    if (itemLat && itemLng) {
                        WidgetItem.itemData.currentCoordinates = [itemLng, itemLat];
                    }
                }
            }

            WidgetItem.itemData = {
                items: null,
                currentCoordinates: null
            };
            WidgetItem.locationData = {
                items: null,
                currentCoordinates: null
            };

            var getContextCb = function (err, data) {
                console.log('error-------------', err, 'data--------------', data);
                if (data && data.device)
                    WidgetItem.device = data.device;
            };

            Buildfire.getContext(getContextCb);


            WidgetItem.executeAction = function (actionItem) {
                Buildfire.actionItems.execute(actionItem);
            };

            function getGeoLocation() {

                Buildfire.geo.getCurrentPosition(
                    null,
                    function (err, position) {
                        if (err) {

                            console.error(err);
                        }
                        else {
                            console.log('uesr Location---------', position);
                            $scope.$apply(function () {
                                WidgetItem.locationData.currentCoordinates = [position.coords.longitude, position.coords.latitude];
                                localStorage.setItem('userLocation', JSON.stringify(WidgetItem.locationData.currentCoordinates));
                                console.log(WidgetItem.locationData.currentCoordinates, 'USERLocation');
                            });
                        }
                    }
                );

            }

            if (typeof(Storage) !== "undefined") {
                console.log('data from local storage----', localStorage.getItem('userLocation'));
                var userLocation = localStorage.getItem('userLocation');
                if (userLocation) {
                    WidgetItem.locationData.currentCoordinates = JSON.parse(userLocation);
                }
                else
                    getGeoLocation(); // get data if not in cache
            }
            else
                getGeoLocation(); // get data if localStorage is not supported

            /* $scope.$on("Carousel:LOADED", function () {
             if (!WidgetItem.view) {
             console.log('if------', WidgetItem.view);
             WidgetItem.view = new Buildfire.components.carousel.view("#carousel", []);
             }
             if (WidgetItem.item && WidgetItem.item.data && WidgetItem.item.data.images && WidgetItem.view) {
             WidgetItem.view.loadItems(WidgetItem.item.data.images);
             } else {
             WidgetItem.view.loadItems([]);
             }
             });*/

            if (WidgetItem.locationData && WidgetItem.locationData.currentCoordinates && WidgetItem.placeInfo && WidgetItem.placeInfo.data && WidgetItem.placeInfo.data.settings)
                calDistance(WidgetItem.locationData.currentCoordinates, [WidgetItem.item], WidgetItem.placeInfo.data.settings.showDistanceIn);

            WidgetItem.clearOnUpdateListener = Buildfire.datastore.onUpdate(function (event) {
                    console.log('OnUpdate method called----------------------************************', event);
                    if (event.tag == 'items' && event.data) {
                        $timeout(function () {
                            $scope.imagesUpdated = false;
                            WidgetItem.item = event;
                            if (event.data.address && event.data.address.lng && event.data.address.lat) {
                                WidgetItem.itemData.currentCoordinates = [event.data.address.lng, event.data.address.lat];
                                calDistance(WidgetItem.locationData.currentCoordinates, [event], WidgetItem.placeInfo.data.settings.showDistanceIn);
                            }
                            if (event.data.images)
                                initCarousel(event.data.images);
                            if (!$scope.$$phase)$scope.$digest();
                            $scope.imagesUpdated = !!event.data.images;
                        },0);
                    }
                    else if (event.tag == 'placeInfo' && event.data) {

                        if (event.data.settings)
                            calDistance(WidgetItem.locationData.currentCoordinates, [WidgetItem.item], event.data.settings.showDistanceIn);
                        WidgetItem.placeInfo = event;

                        $timeout(function () {
                            initCarousel(WidgetItem.item.data.images);
                        }, 1500);

                        if (!$scope.$$phase)$scope.$digest();
                    }
                }
            );

            WidgetItem.openLinks = function (actionItems) {
                if (actionItems && actionItems.length) {
                    var options = {};
                    var callback = function (error, result) {
                        if (error) {
                            console.error('Error:', error);
                        }
                    };
                    Buildfire.actionItems.list(actionItems, options, callback);
                }
            };

            WidgetItem.openMap = function () {
                if (WidgetItem.item && WidgetItem.item.data && WidgetItem.item.data.address)
                    if (WidgetItem.device && WidgetItem.device.platform == 'ios')
                        Buildfire.navigation.openWindow('maps://maps.google.com/maps?daddr=' + WidgetItem.item.data.address.lat + ',' + WidgetItem.item.data.address.lng);
                    else
                        Buildfire.navigation.openWindow('http://maps.google.com/maps?daddr=' + WidgetItem.item.data.address.lat + ',' + WidgetItem.item.data.address.lng);
            };

            // Show Body Content when it is not blank
            WidgetItem.showBodyContent = function () {
                if ((WidgetItem.item && WidgetItem.item.data) &&(WidgetItem.item.data.bodyContent == '<p>&nbsp;<br></p>' || WidgetItem.item.data.bodyContent == '<p><br data-mce-bogus="1"></p>' || WidgetItem.item.data.bodyContent==''))
                    return false;
                else
                    return true;
            };

           /* //syn with widget side
            Messaging.sendMessageToControl({
                name: EVENTS.ROUTE_CHANGE,
                message: {
                    path: PATHS.ITEM,
                    id: $routeParams.itemId,
                    secId: $routeParams.sectionId
                }
            });*/

            function initCarousel(images) {
                if (angular.element('#carouselItemDetails').length) {
                    if (WidgetItem.view && angular.element('#carouselItemDetails').hasClass('plugin-slider')) {
                        WidgetItem.view.loadItems(images);
                    }
                    else {
                        WidgetItem.view = new Buildfire.components.carousel.view("#carouselItemDetails", images);
                    }
                }
            }

            function calDistance(origin, destination, distanceUnit) {
                GeoDistance.getDistance(origin, destination, distanceUnit).then(function (data) {
                        if (data && data.rows[0] && data.rows[0].elements[0] && data.rows[0].elements[0].distance) {
                            WidgetItem.distance = data.rows[0].elements[0].distance.text;
                        }
                    },
                    function (err) {
                        console.error('error while calculating distance---------------------', err);
                    });
            }

            var offCallMeFn = $rootScope.$on(EVENTS.ROUTE_CHANGE_1, function (e, data) {
                Location.goToHome();
                if (!$scope.$$phase)$scope.$digest();
            });

            /**
             * will called when controller scope has been destroyed.
             */
            $scope.$on("$destroy", function () {
                WidgetItem.clearOnUpdateListener.clear();
                offCallMeFn();
            });
        }
        ])
    ;
})(window.angular, window);