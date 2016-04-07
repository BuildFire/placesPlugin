(function (angular,buildfire) {
    "use strict";
    angular
        .module('placesContentDirectives', [])
        .directive('googleLocationSearch', function () {
            return {
                restrict: 'A',
                scope: {setLocationInController: '&callbackFn'},
                link: function (scope, element, attributes) {
                    var options = {
                        types: ['geocode']
                    };
                    var autocomplete = new google.maps.places.Autocomplete(element[0], options);
                    google.maps.event.addListener(autocomplete, 'place_changed', function () {
                        var location = autocomplete.getPlace().formatted_address;
                        if (autocomplete.getPlace().geometry) {
                            var coordinates = [autocomplete.getPlace().geometry.location.lng(), autocomplete.getPlace().geometry.location.lat()];
                            scope.setLocationInController({
                                data: {
                                    location: location,
                                    coordinates: coordinates
                                }
                            });
                        }
                    });
                }
            };
        })
        .directive("googleMap", function () {
            return {
                template: "<div></div>",
                replace: true,
                scope: {coordinates: '=', draggedGeoData: '&draggedFn'},
                link: function (scope, elem, attrs) {
                    var geocoder = new google.maps.Geocoder();
                    var location;
                    scope.$watch('coordinates', function (newValue, oldValue) {
                        if (newValue) {
                            scope.coordinates = newValue;
                            if (scope.coordinates.length) {
                                var map = new google.maps.Map(elem[0], {
                                    center: new google.maps.LatLng(scope.coordinates[1], scope.coordinates[0]),
                                    zoomControl: false,
                                    streetViewControl: false,
                                    mapTypeControl: false,
                                    zoom: 15,
                                    mapTypeId: google.maps.MapTypeId.ROADMAP
                                });
                                var marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(scope.coordinates[1], scope.coordinates[0]),
                                    map: map,
                                    draggable: true
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
                            }
                            google.maps.event.addListener(marker, 'dragend', function (event) {
                                scope.coordinates = [event.latLng.lng(), event.latLng.lat()];
                                geocoder.geocode({
                                    latLng: marker.getPosition()
                                }, function (responses) {
                                    if (responses && responses.length > 0) {
                                        scope.location = responses[0].formatted_address;
                                        scope.draggedGeoData({
                                            data: {
                                                location: scope.location,
                                                coordinates: scope.coordinates
                                            }
                                        });
                                    } else {
                                        location = 'Cannot determine address at this location.';
                                    }

                                });
                            });
                        }
                    }, true);
                }
            }
        })
        .directive('ngEnter', function () {
            return function (scope, element, attrs) {
                element.bind("keydown keypress", function (event) {
                    if (event.which === 13) {
                        var val = $(element).val(),
                            regex = /^[0-9\-\., ]+$/g;
                        if (regex.test(val)) {
                            scope.$apply(function () {
                                scope.$eval(attrs.ngEnter);
                            });

                            event.preventDefault();
                        }
                    }
                });
            };
        })
        .directive('carouselComponent', ['$timeout',function ($timeout) {
            return {
                template: "<div id='carousel'></div>",
                replace: true,
                scope: {images: '='},
                link: function (scope, elem, attrs) {
                    console.log('Directive attached-----------Content Section----------',scope,elem,attrs);
                    var editor = new buildfire.components.carousel.editor("#carousel");
                    if(scope.images && scope.images.length>0)
                    editor.loadItems(scope.images);
                    console.log('Images in directive-------------Content Section---------------',scope.images);
                    // this method will be called when a new item added to the list
                    editor.onAddItems = function (items) {
                        if (!scope.images)
                            scope.images = [];
                        console.log('onAddItems called from directive-----------------',items);
                        $timeout(function(){
                            scope.$apply(function () {
                                scope.images.push.apply(scope.images, items);
                            });
                        },0);
                    };
                    // this method will be called when an item deleted from the list
                    editor.onDeleteItem = function (item, index) {
                        $timeout(function(){
                            scope.$apply(function () {
                                scope.images.splice(index, 1);
                            });
                        },0);
                    };
                    // this method will be called when you edit item details
                    editor.onItemChange = function (item, index) {
                        $timeout(function(){
                            scope.$apply(function () {
                                scope.images.splice(index, 1, item);
                            });
                        },0);
                    };
                    // this method will be called when you change the order of items
                    editor.onOrderChange = function (item, oldIndex, newIndex) {
                        $timeout(function(){
                            scope.$apply(function () {
                                var temp = scope.images[oldIndex];
                                scope.images[oldIndex] = scope.images[newIndex];
                                scope.images[newIndex] = temp;
                            });
                        },0);
                    };
                }
            };
        }])
        .directive("loadImage", [function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.attr("src", "../../../styles/media/holder-" + attrs.loadImage + ".gif");

                    var elem = $("<img>");
                    elem[0].onload = function () {
                        element.attr("src", attrs.finalSrc);
                        elem.remove();
                    };
                    elem.attr("src", attrs.finalSrc);
                }
            };
        }]);
})(window.angular,buildfire);