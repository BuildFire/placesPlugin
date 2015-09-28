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
                scope: {coordinates: '=', items: '='},
                link: function (scope, elem, attrs) {
                    scope.$watch('coordinates', function (newValue, oldValue) {
                        if (newValue) {

                            // Create the map.
                            var map = new google.maps.Map(elem[0], {
                                streetViewControl: false,
                                mapTypeControl: false,
                                zoom: 4,
                                center: {lat: scope.items[0].data.address.lat, lng: scope.items[0].data.address.lng},
                                mapTypeId: google.maps.MapTypeId.TERRAIN
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

                            var image = {
                                url: '../resources/google_marker_icon.png',
                                // This marker is 20 pixels wide by 32 pixels high.
                                size: new google.maps.Size(20, 20),
                                // The origin for this image is (0, 0).
                                origin: new google.maps.Point(0, 0),
                                // The anchor for this image is the base of the flagpole at (0, 32).
                                anchor: new google.maps.Point(0, 32)
                            };
                            // Shapes define the clickable region of the icon. The type defines an HTML
                            // <area> element 'poly' which traces out a polygon as a series of X,Y points.
                            // The final coordinate closes the poly by connecting to the first coordinate.
                            var shape = {
                                coords: [1, 1, 1, 20, 18, 20, 18, 1],
                                type: 'poly'
                            };
                            for (var _index = 0; _index < scope.items.length; _index++) {
                                var _place = scope.items[_index];
                                var marker = new google.maps.Marker({
                                    position: {lat: _place.data.address.lat, lng: _place.data.address.lng},
                                    map: map,
                                    icon: image,
                                    shape: shape,
                                    title: _place.data.itemTitle,
                                    zIndex: _index
                                });
                            }
                        }
                    }, true);
                }
            }
        })
})(window.angular, undefined);