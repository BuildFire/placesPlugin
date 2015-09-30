(function (angular, window) {
    angular
        .module('placesWidget')
        .controller('WidgetItemCtrl', ['$scope', 'COLLECTIONS', 'DB', '$routeParams', 'Buildfire', '$rootScope', 'GeoDistance', 'Messaging', 'Location', 'EVENTS', 'PATHS', function ($scope, COLLECTIONS, DB, $routeParams, Buildfire, $rootScope, GeoDistance, Messaging, Location, EVENTS, PATHS) {
            var WidgetItem = this, view = null;
            WidgetItem.placeInfo = null;
            console.log('WidgetItemCtrl called');
            WidgetItem.item = {data: {}};
            var PlaceInfo = new DB(COLLECTIONS.PlaceInfo);
            var Items = new DB(COLLECTIONS.Items);
            if ($routeParams.itemId) {
                Items.getById($routeParams.itemId).then(
                    function (result) {
                        WidgetItem.item = result;
                        if (WidgetItem.item.data && WidgetItem.item.data.images)
                            initCarousel(WidgetItem.item.data.images);
                        WidgetItem.locationData = {
                            items: null,
                            currentCoordinates: [WidgetItem.item.data.address.lng, WidgetItem.item.data.address.lat]
                        };
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

            WidgetItem.locationData = {
                items: null,
                currentCoordinates: [77, 28]
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


            /**
             * init() private function
             * It is used to fetch previously saved user's data
             */
            var init = function () {
                var success = function (result) {
                        if (result && result.data && result.id) {
                            WidgetItem.placeInfo = result;
                        }
                    }
                    , error = function (err) {
                        console.error('Error while getting data', err);
                    };
                PlaceInfo.get().then(success, error);
            };

            $rootScope.$on("Carousel:LOADED", function () {
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

            Buildfire.datastore.onUpdate(function (event) {
                console.log('ON UPDATE called============', event);
                if (event.tag == 'items' && event.data) {
                    WidgetItem.item = event;
                    $scope.$digest();
                    if (event.data.images)
                        initCarousel(event.data.images);
                }
            });

            function initCarousel(images) {
                if (view) {
                    view.loadItems(images);
                }
            }

            /**
             * init() function invocation to fetch previously saved user's data from datastore.
             */
            init();
        }]);
})(window.angular, window);