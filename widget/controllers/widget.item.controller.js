(function (angular, window) {
    angular
        .module('placesWidget')
        .controller('WidgetItemCtrl', ['$scope', 'COLLECTIONS', 'DB', '$routeParams', 'Buildfire', '$rootScope', 'GeoDistance', 'Messaging', 'Location', 'EVENTS', 'PATHS', 'AppConfig', 'placesInfo', 'Orders', 'OrdersItems', 'item', function ($scope, COLLECTIONS, DB, $routeParams, Buildfire, $rootScope, GeoDistance, Messaging, Location, EVENTS, PATHS, AppConfig, placesInfo, Orders, OrdersItems, item) {
            AppConfig.changeBackgroundTheme();
            var WidgetItem = this
                , view = null
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
                            sortBy: Orders.ordersMap.Newest,
                            rankOfLastItem: '',
                            sortByItems: OrdersItems.ordersMap.Newest
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

            WidgetItem.locationData = {
                items: null,
                currentCoordinates: null
            };

            if (item) {
                WidgetItem.item = item;
            }
            else {
                WidgetItem.item = _itemData;
            }
            WidgetItem.item = result;
            if (WidgetItem.item.data) {
                if (WidgetItem.item.data.backgroundImage)
                    AppConfig.changeBackgroundTheme(WidgetItem.item.data.backgroundImage);
                if (WidgetItem.item.data.images)
                    initCarousel(WidgetItem.item.data.images);
                itemLat = (WidgetItem.item.data.address && WidgetItem.item.data.address.lat) ? WidgetItem.item.data.address.lat : null;
                itemLng = (WidgetItem.item.data.address && WidgetItem.item.data.address.lng) ? WidgetItem.item.data.address.lng : null;
                if (itemLat && itemLng) {
                    WidgetItem.locationData.currentCoordinates = [itemLng, itemLat];
                }

            }

            function getGeoLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
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
                console.log('carousel added------', WidgetItem.item);
                if (!view) {
                    console.log('if------', view);
                    view = new Buildfire.components.carousel.view("#carousel", []);
                }
                if (WidgetItem.item && WidgetItem.item.data && WidgetItem.item.data.images && view) {
                    view.loadItems(WidgetItem.item.data.images);
                } else {
                    view.loadItems([]);
                }
            });

            var clearOnUpdateListener = Buildfire.datastore.onUpdate(function (event) {
                if (event.tag == 'items' && event.data) {
                    WidgetItem.locationData = {
                        items: null,
                        currentCoordinates: [event.data.address.lng, event.data.address.lat]
                    };
                    WidgetItem.item = event;
                    AppConfig.changeBackgroundTheme(WidgetItem.item.data.backgroundImage);
                    $scope.$digest();
                    if (event.data.images)
                        initCarousel(event.data.images);
                }
                else if (event.tag == 'placeInfo' && event.data) {
                    WidgetItem.placeInfo = event;
                    $scope.$digest();
                }
            });

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
                if (view) {
                    view.loadItems(images);
                }
            }

            /**
             * will called when controller scope has been destroyed.
             */
            $scope.$on("$destroy", function () {
                clearOnUpdateListener.clear();
            });
        }]);
})(window.angular, window);