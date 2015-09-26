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
                scope: {coordinates: '='},
                link: function (scope, elem, attrs) {
                    scope.$watch('coordinates', function (newValue, oldValue) {
                        if (newValue) {
                            var citymap = {
                                chicago: {
                                    center: {lat: 41.878, lng: -87.629},
                                    population: 2714856
                                },
                                newyork: {
                                    center: {lat: 40.714, lng: -74.005},
                                    population: 8405837
                                },
                                losangeles: {
                                    center: {lat: 34.052, lng: -118.243},
                                    population: 3857799
                                },
                                vancouver: {
                                    center: {lat: 49.25, lng: -123.1},
                                    population: 603502
                                }
                            };

                            // Create the map.
                            var map = new google.maps.Map(elem[0], {
                                streetViewControl: false,
                                mapTypeControl: false,
                                zoom: 1,
                                center: {lat: 37.090, lng: -95.712},
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
                            // Construct the circle for each value in citymap.
                            // Note: We scale the area of the circle based on the population.
                            for (var city in citymap) {
                                // Add the circle for this city to the map.
                                var cityCircle = new google.maps.Circle({
                                    strokeColor: '#FF0000',
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                    fillColor: '#FF0000',
                                    fillOpacity: 0.35,
                                    map: map,
                                    center: citymap[city].center,
                                    radius: Math.sqrt(citymap[city].population) * 100
                                });
                            }
                        }
                    }, true);
                }
            }
        })
})(window.angular, undefined);