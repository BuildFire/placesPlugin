(function (angular, window) {
    angular
        .module('placesWidget')
        .controller('WidgetItemCtrl', ['$scope', 'COLLECTIONS', 'DB', '$routeParams', 'Buildfire', '$rootScope', 'GeoDistance', 'Messaging', 'Location', 'EVENTS', 'PATHS', 'AppConfig', 'placesInfo', 'Orders', 'OrdersItems', 'item', function ($scope, COLLECTIONS, DB, $routeParams, Buildfire, $rootScope, GeoDistance, Messaging, Location, EVENTS, PATHS, AppConfig, placesInfo, Orders, OrdersItems, item) {
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

            if (placesInfo) {
                WidgetItem.placeInfo = placesInfo;
            }
            else {
                WidgetItem.placeInfo = _infoData;
            }

            if (item) {
                WidgetItem.item = item;
            }
            else {
                WidgetItem.item = _itemData;
            }
            WidgetItem.itemData = {
                items: null,
                currentCoordinates: null
            };
            WidgetItem.locationData = {
                items: null,
                currentCoordinates: null
            };
            if (WidgetItem.item.data) {
                if (WidgetItem.item.data.images)
                    initCarousel(WidgetItem.item.data.images);
                itemLat = (WidgetItem.item.data.address && WidgetItem.item.data.address.lat) ? WidgetItem.item.data.address.lat : null;
                itemLng = (WidgetItem.item.data.address && WidgetItem.item.data.address.lng) ? WidgetItem.item.data.address.lng : null;
                if (itemLat && itemLng) {
                    WidgetItem.itemData.currentCoordinates = [itemLng, itemLat];
                }

            }

            var getContextCb=function(err,data){
                console.log('error-------------',err,'data--------------',data);
                if(data && data.device)
                WidgetItem.device=data.device;
            };

            Buildfire.getContext(getContextCb);


            WidgetItem.executeAction = function (actionItem) {
                Buildfire.actionItems.execute(actionItem);
            };

            function getGeoLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        console.log('uesr Location---------', position);
                        $scope.$apply(function () {
                            WidgetItem.locationData.currentCoordinates = [position.coords.longitude, position.coords.latitude];
                            localStorage.setItem('userLocation', JSON.stringify(WidgetItem.locationData.currentCoordinates));
                            console.log(WidgetItem.locationData.currentCoordinates, 'USERLocation');
                        });
                    });
                }
                // else - in this case, default coords will be used
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

            $scope.$on("Carousel:LOADED", function () {
                if (!WidgetItem.view) {
                    console.log('if------', WidgetItem.view);
                    WidgetItem.view = new Buildfire.components.carousel.view("#carousel", []);
                }
                if (WidgetItem.item && WidgetItem.item.data && WidgetItem.item.data.images && WidgetItem.view) {
                    WidgetItem.view.loadItems(WidgetItem.item.data.images);
                } else {
                    WidgetItem.view.loadItems([]);
                }
            });

            if (WidgetItem.locationData && WidgetItem.locationData.currentCoordinates)
                calDistance(WidgetItem.locationData.currentCoordinates, [WidgetItem.item], WidgetItem.placeInfo.data.settings.showDistanceIn);

            WidgetItem.clearOnUpdateListener = Buildfire.datastore.onUpdate(function (event) {
                    if (event.tag == 'items' && event.data) {
                        WidgetItem.item = event;
                        if (event.data.address && event.data.address.lng && event.data.address.lat) {
                            WidgetItem.itemData.currentCoordinates = [event.data.address.lng, event.data.address.lat];
                            calDistance(WidgetItem.locationData.currentCoordinates, [event], WidgetItem.placeInfo.data.settings.showDistanceIn);
                        }
                        if (event.data.images)
                            initCarousel(event.data.images);
                        $scope.$digest();
                    }
                    else if (event.tag == 'placeInfo' && event.data) {
                        if (event.data.settings)
                            calDistance(WidgetItem.locationData.currentCoordinates, [WidgetItem.item], event.data.settings.showDistanceIn);
                        WidgetItem.placeInfo = event;
                        $scope.$digest();
                    }
                }
            );

            WidgetItem.openMap = function () {
                if (WidgetItem.item && WidgetItem.item.data && WidgetItem.item.data.address)
                    if (WidgetItem.device && WidgetItem.device.platform == 'ios')
                        Buildfire.navigation.openWindow('maps://maps.google.com/maps?daddr=' + WidgetItem.item.data.address.lat + ',' + WidgetItem.item.data.address.lng );
                    else
                        Buildfire.navigation.openWindow('http://maps.google.com/maps?daddr='  + WidgetItem.item.data.address.lat + ',' + WidgetItem.item.data.address.lng );
            };

            // Show Body Content when it is not blank
            WidgetItem.showBodyContent = function () {
                if (WidgetItem.item.data.bodyContent == '<p>&nbsp;<br></p>' || WidgetItem.item.data.bodyContent == '<p><br data-mce-bogus="1"></p>')
                    return false;
                else
                    return true;
            };

            //syn with widget side
            Messaging.sendMessageToControl({
                name: EVENTS.ROUTE_CHANGE,
                message: {
                    path: PATHS.ITEM,
                    id: $routeParams.itemId,
                    secId: $routeParams.sectionId
                }
            });

            function initCarousel(images) {
                if (WidgetItem.view) {
                    WidgetItem.view.loadItems(images);
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
                $scope.$apply();
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