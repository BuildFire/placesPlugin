(function (angular, window) {
    angular
        .module('placesWidget')
        .controller('WidgetItemCtrl', ['$scope', 'COLLECTIONS', 'DB', '$routeParams', 'Buildfire', '$rootScope', 'GeoDistance', 'Messaging', 'Location', 'EVENTS', 'PATHS', 'AppConfig', function ($scope, COLLECTIONS, DB, $routeParams, Buildfire, $rootScope, GeoDistance, Messaging, Location, EVENTS, PATHS, AppConfig) {
            AppConfig.changeBackgroundTheme();
            var WidgetItem = this
                , view = null
                , PlaceInfo = new DB(COLLECTIONS.PlaceInfo)
                , Items = new DB(COLLECTIONS.Items)
                , itemLat = ''
                , itemLng = '';

            WidgetItem.locationData = {
                items: null,
                currentCoordinates: null
            };
            WidgetItem.item = {data: {}};

            if ($routeParams.itemId) {
                Items.getById($routeParams.itemId).then(
                    function (result) {
                        WidgetItem.item = result;
                        if (result.data && result.data.backgroundImage)
                            AppConfig.changeBackgroundTheme(result.data.backgroundImage);
                        if (WidgetItem.item.data && WidgetItem.item.data.images)
                            initCarousel(WidgetItem.item.data.images);
                        itemLat = (WidgetItem.item.data.address && WidgetItem.item.data.address.lat) ? WidgetItem.item.data.address.lat : null;
                        itemLng = (WidgetItem.item.data.address && WidgetItem.item.data.address.lng) ? WidgetItem.item.data.address.lng : null;
                        if (itemLat && itemLng) {
                            WidgetItem.locationData.currentCoordinates = [itemLng, itemLat];
                        } else {
                            WidgetItem.locationData.currentCoordinates = null;
                        }
                    },
                    function (err) {
                        console.error('Error while getting item-', err);
                    }
                );
            }
            else {
                WidgetItem.item = {
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
                }
            }

            WidgetItem.calculateDistance = function () {

            };

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
            });

            //syn with widget side
            Messaging.sendMessageToControl({
                name: EVENTS.ROUTE_CHANGE,
                message: {
                    path: PATHS.ITEM,
                    id: $routeParams.itemId,
                    secId:$routeParams.sectionId
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