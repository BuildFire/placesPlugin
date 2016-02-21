(function (angular,buildfire) {
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
        .directive("mapBuildFireCarousel", ["$rootScope", '$timeout', function ($rootScope, $timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $timeout(function () {
                        $rootScope.$broadcast("Map Carousel:LOADED");
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
                    elem.css('min-height', '596px').css('width', '100%');
                    scope.$watch('locationData', function (newValue, oldValue) {
                        if (newValue) {
                            var mapCenterLng = (scope.locationData && scope.locationData.currentCoordinates && scope.locationData.currentCoordinates.length && scope.locationData.currentCoordinates[0]) ? scope.locationData.currentCoordinates[0] : -87.7679;
                            var mapCenterLat = (scope.locationData && scope.locationData.currentCoordinates && scope.locationData.currentCoordinates.length && scope.locationData.currentCoordinates[1]) ? scope.locationData.currentCoordinates[1] : 41.8718;

                            // Create the map.
                            var map = new google.maps.Map(elem[0], {
                                streetViewControl: false,
                                mapTypeControl: false,
                                zoom: 5,
                                center: {lat: mapCenterLat, lng: mapCenterLng},
                                mapTypeId: google.maps.MapTypeId.ROADMAP,
                                zoomControlOptions: {
                                    position: google.maps.ControlPosition.RIGHT_TOP
                                }
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
                                    scaledSize: new google.maps.Size(20,20),
                                    // The origin for this image is (0, 0).
                                    origin: new google.maps.Point(0, 0),
                                    // The anchor for this image is the base of the flagpole at (0, 32).
                                    anchor: new google.maps.Point(0, 32)
                                }
                            }

                            var selectedLocation = null;

                            var currentLocationIconImageUrl = 'assets/images/google_marker_blue_icon.png';
                            //var currentLocationIconImageUrl = 'assets/images/blue.png';
                            var placeLocationIconImageUrl = 'assets/images/google_marker_red_icon.png';
                            var selectedLocationIconImageUrl = 'assets/images/google_marker_green_icon.png';

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
                                    shape: shape,
                                    optimized: false
                                });
                            }

                            var placeLocationMarkers = [];
                            if (scope.locationData && scope.locationData.items && scope.locationData.items.length) {
                                for (var _index = 0; _index < scope.locationData.items.length; _index++) {

                                    var _place = scope.locationData.items[_index]
                                        , marker = '';

                                    if (_index == 0) { // this is to center the map on the first item
                                        map.setCenter(new google.maps.LatLng(_place.data.address.lat, _place.data.address.lng));
                                    }

                                    if (_place.data && _place.data.address && _place.data.address.lat && _place.data.address.lng) {
                                        marker = new google.maps.Marker({
                                            position: {lat: _place.data.address.lat, lng: _place.data.address.lng},
                                            map: map,
                                            icon: placeLocationIcon,
                                            shape: shape,
                                            title: _place.data.itemTitle,
                                            zIndex: _index,
                                            optimized: false
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


                            map.addListener('click', function () {
                                if (selectedLocation) {
                                    scope.markerCallback(null);
                                    selectedLocation.setIcon(placeLocationIcon);
                                }
                            });
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
                                mapTypeId: google.maps.MapTypeId.ROADMAP,
                                zoomControlOptions: {
                                    position: google.maps.ControlPosition.RIGHT_TOP
                                }
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

                            var placeLocationIconImageUrl = 'assets/images/google_marker_red_icon.png';

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
                                    shape: shape,
                                    optimized:false
                                });
                                marker.addListener('click', function () {
                                    openInMap(scope.locationData.currentCoordinates[1], scope.locationData.currentCoordinates[0]);
                                });
                                //}
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
                            element.attr('src', 'assets/images/placeholder.png'); // set default image
                        }

                    });
                }
            };
        })
        .directive('imageCarousel', function () {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    scope.carousel = null;
                    scope.isCarouselInitiated = false;
                    function initCarousel() {
                        scope.carousel = null;
                        setTimeout(function () {
                            var obj = {
                                'slideSpeed': 300,
                                'dots': false,
                                'autoplay': true,
                                'margin': 10
                            };

                            var totalImages = parseInt(attrs.imageCarousel, 10);
                            if (totalImages) {
                                if (totalImages > 1) {
                                    obj['loop'] = true;
                                }
                                scope.carousel = $(elem).owlCarousel(obj);
                                scope.isCarouselInitiated = true;
                            }
                            scope.$apply();
                        }, 0);
                    }

                    initCarousel();

                    scope.$watch("imagesUpdated", function (newVal, oldVal) {
                        if (newVal) {
                            if (scope.isCarouselInitiated) {
                                scope.carousel.trigger("destroy.owl.carousel");
                                scope.isCarouselInitiated = false;
                            }
                            $(elem).find(".owl-stage-outer").remove();
                            initCarousel();
                        }
                    });
                }
            }
        })
        .directive("viewSwitcher", ["ViewStack", "$rootScope", '$compile', "$templateCache",
            function (ViewStack, $rootScope, $compile, $templateCache) {
                return {
                    restrict: 'AE',
                    link: function (scope, elem, attrs) {
                        var views = 0;
                        manageDisplay();
                        $rootScope.$on('VIEW_CHANGED', function (e, type, view) {
                            if (type === 'PUSH') {
                                var newScope = $rootScope.$new();
                                newScope.currentItemListLayout = "templates/" + view.template + ".html";

                                var _newView = '<div  id="' + view.template + '" ><div class="no-scroll slide content dynamic-view height-hundred-pc" data-back-img="{{backgroundImage}}" ng-if="currentItemListLayout" ng-include="currentItemListLayout"></div></div>';
                                if (view.params && view.params.controller) {
                                    _newView = '<div id="' + view.template + '" ><div class="no-scroll slide content dynamic-view height-hundred-pc" data-back-img="{{backgroundImage}}" ng-if="currentItemListLayout" ng-include="currentItemListLayout" ng-controller="' + view.params.controller + '" ></div></div>';
                                }
                                var parTpl = $compile(_newView)(newScope);
                                if (view.params && view.params.shouldUpdateTemplate) {
                                    newScope.$on("ITEM_LIST_LAYOUT_CHANGED", function (evt, layout, needDigest) {
                                        newScope.currentItemListLayout = "templates/" + layout + ".html";
                                        if (needDigest) {
                                            newScope.$digest();
                                        }
                                    });
                                }
                                $(elem).append(parTpl);
                                views++;
                                showHideMainBtmMenu();

                            } else if (type === 'POP') {
                                var _elToRemove = $(elem).find('#' + view.template),
                                    _child = _elToRemove.children("div").eq(0);

                                _child.addClass("ng-leave ng-leave-active");
                                _child.on("webkitTransitionEnd transitionend oTransitionEnd", function (e) {
                                    _elToRemove.remove();
                                    views--;
                                    showHideMainBtmMenu();
                                });

                                //$(elem).find('#' + view.template).remove();
                            }
                            else if (type === 'POPALL') {
                                console.log(view);
                                angular.forEach(view, function (value, key) {
                                    $(elem).find('#' + value.template).remove();
                                });
                                views = 0;
                                showHideMainBtmMenu();
                            }
                            manageDisplay();
                        });

                        function manageDisplay() {
                            if (views) {
                                $(elem).removeClass("ng-hide");
                            } else {
                                $(elem).addClass("ng-hide");
                            }
                        }

                        function  showHideMainBtmMenu(){
                            if (views) {
                                $("#mainViewBtmMenu").hide();
                            } else {
                                $("#mainViewBtmMenu").show();
                                $("#onUpdateListener").click();
                            }

                       /*     var vs = ViewStack.getCurrentView();
                            switch(vs.template){
                                case 'section':break;
                                case 'item':break;
                                case undefined:break;

                            }*/
                        }

                    }
                };
            }])
        .directive('backImg', ["$filter", "$rootScope", function ($filter, $rootScope) {
            return function (scope, element, attrs) {
                attrs.$observe('backImg', function (value) {
                    console.log('bgimag',value);
                    var img = '';
                    if (value) {
                        img = $filter("cropImage")(value, $rootScope.deviceWidth, $rootScope.deviceHeight, true);
                        element.attr("style", 'background:url(' + img + ') !important');
                        element.css({
                            'background-size': 'cover'
                        });
                    }
                    else {
                        element.attr("style", 'background-color:white');
                        element.css({
                            'background-size': 'cover'
                        });
                    }
                });
            };
        }]);
})(window.angular,window.buildfire);