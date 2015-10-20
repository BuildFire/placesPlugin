(function (angular) {
    angular
        .module('placesWidget')
        .directive("buildFireCarousel", ["$rootScope", '$timeout', function ($rootScope, $timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $timeout(function () {
                        $rootScope.$broadcast("Carousel:LOADED");
                    }, 0);
                }
            };
        }])
        .directive("googleMap", function () {
            return {
                template: "<div></div>",
                replace: true,
                scope: {locationData: '=locationData', markerCallback: '=markerCallback'},
                link: function (scope, elem, attrs) {
                    elem.css('min-height', '556px');
                    scope.$watch('locationData', function (newValue, oldValue) {
                        if (newValue) {
                            var mapCenterLng = (scope.locationData.currentCoordinates.length && scope.locationData.currentCoordinates[0]) ? scope.locationData.currentCoordinates[0] : 78.8718;
                            var mapCenterLat = (scope.locationData.currentCoordinates.length && scope.locationData.currentCoordinates[1]) ? scope.locationData.currentCoordinates[1] : 21.7679;

                            // Create the map.
                            var map = new google.maps.Map(elem[0], {
                                streetViewControl: false,
                                mapTypeControl: false,
                                zoom: 8,
                                center: {lat: mapCenterLat, lng: mapCenterLng},
                                mapTypeId: google.maps.MapTypeId.ROADMAP
                            });

                            var styleOptions = {
                                name: "Report Error Hide Style"
                            };
                            var MAP_STYLE = [
                                {
                                    stylers: [
                                        {visibility: "on"}
                                    ]
                                }];
                            var mapType = new google.maps.StyledMapType(MAP_STYLE, styleOptions);
                            map.mapTypes.set("Report Error Hide Style", mapType);
                            map.setMapTypeId("Report Error Hide Style");

                            function getCustomMarkerIcon(_imageUrl) {
                                return {
                                    url: _imageUrl,
                                    // This marker is 20 pixels wide by 32 pixels high.
                                    size: new google.maps.Size(20, 20),
                                    // The origin for this image is (0, 0).
                                    origin: new google.maps.Point(0, 0),
                                    // The anchor for this image is the base of the flagpole at (0, 32).
                                    anchor: new google.maps.Point(0, 32)
                                }
                            }

                            var selectedLocation = null;

                            var currentLocationIconImageUrl = '../resources/google_marker_blue_icon.png';
                            var placeLocationIconImageUrl = '../resources/google_marker_red_icon.png';
                            var selectedLocationIconImageUrl = '../resources/google_marker_green_icon.png';

                            var currentLocationIcon = getCustomMarkerIcon(currentLocationIconImageUrl);
                            var placeLocationIcon = getCustomMarkerIcon(placeLocationIconImageUrl);
                            var selectedLocationIcon = getCustomMarkerIcon(selectedLocationIconImageUrl);

                            // Shapes define the clickable region of the icon. The type defines an HTML
                            // <area> element 'poly' which traces out a polygon as a series of X,Y points.
                            // The final coordinate closes the poly by connecting to the first coordinate.
                            var shape = {
                                coords: [1, 1, 1, 20, 18, 20, 18, 1],
                                type: 'poly'
                            };

                            if (scope.locationData && scope.locationData.currentCoordinates && scope.locationData.currentCoordinates.length) {
                                var currentLocationMarker = new google.maps.Marker({
                                    position: {
                                        lat: scope.locationData.currentCoordinates[1],
                                        lng: scope.locationData.currentCoordinates[0]
                                    },
                                    map: map,
                                    icon: currentLocationIcon,
                                    shape: shape
                                });
                            }

                            var placeLocationMarkers = [];
                            if (scope.locationData && scope.locationData.items && scope.locationData.items.length) {
                                for (var _index = 0; _index < scope.locationData.items.length; _index++) {
                                    var _place = scope.locationData.items[_index]
                                        , marker = '';
                                    if (_place.data && _place.data.address && _place.data.address.lat && _place.data.address.lng) {
                                        marker = new google.maps.Marker({
                                            position: {lat: _place.data.address.lat, lng: _place.data.address.lng},
                                            map: map,
                                            icon: placeLocationIcon,
                                            shape: shape,
                                            title: _place.data.itemTitle,
                                            zIndex: _index
                                        });
                                        marker.addListener('click', function () {
                                            var _this = this;
                                            if (selectedLocation) {
                                                selectedLocation.setIcon(placeLocationIcon);
                                            }

                                            _this.setIcon(selectedLocationIcon);
                                            selectedLocation = _this;
                                            scope.markerCallback(_this.zIndex);
                                        });
                                        placeLocationMarkers.push(marker);
                                    }
                                }
                            }
                            var markerCluster = new MarkerClusterer(map, placeLocationMarkers);
                        }
                    }, true);
                }
            }
        })
        .directive("detailsGoogleMap", function () {
            return {
                template: "<div></div>",
                replace: true,
                scope: {locationData: '=locationData', showWindow: '=showWindow'},
                link: function (scope, elem, attrs) {
                    scope.$watch('locationData', function (newValue, oldValue) {
                        if (newValue) {

                            var mapCenterLng = (scope.locationData && scope.locationData.currentCoordinates && scope.locationData.currentCoordinates.length && scope.locationData.currentCoordinates[0]) ? scope.locationData.currentCoordinates[0] : -87.7679;
                            var mapCenterLat = (scope.locationData && scope.locationData.currentCoordinates && scope.locationData.currentCoordinates.length && scope.locationData.currentCoordinates[1]) ? scope.locationData.currentCoordinates[1] : 41.8718;


                            // Create the map.
                            var map = new google.maps.Map(elem[0], {
                                streetViewControl: false,
                                mapTypeControl: false,
                                zoom: 4,
                                center: {lat: mapCenterLat, lng: mapCenterLng},
                                mapTypeId: google.maps.MapTypeId.ROADMAP
                            });


                            var styleOptions = {
                                name: "Report Error Hide Style"
                            };
                            var MAP_STYLE = [
                                {
                                    stylers: [
                                        {visibility: "on"}
                                    ]
                                }];
                            var mapType = new google.maps.StyledMapType(MAP_STYLE, styleOptions);
                            map.mapTypes.set("Report Error Hide Style", mapType);
                            map.setMapTypeId("Report Error Hide Style");

                            function getCustomMarkerIcon(_imageUrl) {
                                return {
                                    url: _imageUrl,
                                    // This marker is 20 pixels wide by 32 pixels high.
                                    size: new google.maps.Size(20, 20),
                                    // The origin for this image is (0, 0).
                                    origin: new google.maps.Point(0, 0),
                                    // The anchor for this image is the base of the flagpole at (0, 32).
                                    anchor: new google.maps.Point(0, 32)
                                }
                            }

                            var placeLocationIconImageUrl = '../resources/google_marker_red_icon.png';

                            var placeLocationIcon = getCustomMarkerIcon(placeLocationIconImageUrl);

                            // Shapes define the clickable region of the icon. The type defines an HTML
                            // <area> element 'poly' which traces out a polygon as a series of X,Y points.
                            // The final coordinate closes the poly by connecting to the first coordinate.
                            var shape = {
                                coords: [1, 1, 1, 20, 18, 20, 18, 1],
                                type: 'poly'
                            };

                            if (scope.locationData && scope.locationData.currentCoordinates && scope.locationData.currentCoordinates.length) {

                                var marker = new google.maps.Marker({
                                    position: {
                                        lat: scope.locationData.currentCoordinates[1],
                                        lng: scope.locationData.currentCoordinates[0]
                                    },
                                    map: map,
                                    icon: placeLocationIcon,
                                    shape: shape
                                });

                                if (scope.showWindow.toString() != 'false') {
                                    var infowindow = new google.maps.InfoWindow({
                                        content: "<a onclick='openInMap(" + scope.locationData.currentCoordinates[1] + "," + scope.locationData.currentCoordinates[0] + ")'>Get Directions</a>"
                                    });
                                    marker.addListener('click', function () {
                                        infowindow.open(map, marker);
                                    });
                                    infowindow.open(map, marker);
                                }
                                else {
                                    marker.addListener('click', function () {
                                        openInMap(scope.locationData.currentCoordinates[1], scope.locationData.currentCoordinates[0]);
                                    });
                                }
                            }


                        }
                    }, true);
                }
            }
        })
        .directive('defaultImage', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    attrs.$observe('ngSrc', function (ngSrc) {

                        if (!ngSrc) {
                            element.attr('src', 'assets/images/placeholder.jpg'); // set default image
                        }

                    });
                }
            };
        })
})(window.angular, undefined);