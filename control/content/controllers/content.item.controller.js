/**
 * Create self executing function to avoid global scope creation
 */
(function (angular, tinymce) {
    'use strict';
    angular
        .module('placesContent')
        .controller('ContentItemCtrl', ['$scope', 'Buildfire', 'DB', 'COLLECTIONS', '$routeParams', 'Location', 'Utils', '$timeout', 'EVENTS', 'PATHS', 'Messaging', 'item', 'placesInfo', 'DEFAULT_DATA', '$rootScope',
            function ($scope, Buildfire, DB, COLLECTIONS, $routeParams, Location, Utils, $timeout, EVENTS, PATHS, Messaging, item, placesInfo, DEFAULT_DATA, $rootScope) {

                //Hide the INT header part.
                Buildfire.appearance.setHeaderVisibility(false);
                var isNewItemInserted = false;

                //Scroll current view to top when page loaded.
                Buildfire.navigation.scrollTop();

                var tmrDelayForItem = null
                    , Items = new DB(COLLECTIONS.Items)
                    , PlaceInfo = new DB(COLLECTIONS.PlaceInfo)
                    , updating = false;

                var background = new Buildfire.components.images.thumbnail("#background");

                var placeInfoData;
                if (placesInfo) {
                    placeInfoData = placesInfo;
                }
                else {
                    placeInfoData = DEFAULT_DATA.PLACE_INFO;
                }

                $scope.itemShow = 'Content';

                var ContentItem = this;
                ContentItem.currentAddress = null;
                ContentItem.validCoordinatesFailure = false;
                ContentItem.currentCoordinates = null;

                if (item) {
                    ContentItem.item = item;
                    ContentItem.masterItem = angular.copy(ContentItem.item);
                }
                else {
                    ContentItem.item = angular.copy(DEFAULT_DATA.ITEM);
                    if ($routeParams.sectionId != 'allitems')
                        ContentItem.item.data.sections.push($routeParams.sectionId);
                    ContentItem.masterItem = angular.copy(ContentItem.item);
                }

                if (ContentItem.item.data && ContentItem.item.data.backgroundImage) {
                    background.loadbackground(ContentItem.item.data.backgroundImage);
                }

                background.onChange = function (url) {
                    ContentItem.item.data.backgroundImage = url;
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                };

                background.onDelete = function (url) {
                    ContentItem.item.data.backgroundImage = "";
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                };


                //option for wysiwyg
                ContentItem.bodyWYSIWYGOptions = {
                    plugins: 'advlist autolink link image lists charmap print preview',
                    skin: 'lightgray',
                    trusted: true,
                    theme: 'modern',
                    plugin_preview_width: "500",
                    plugin_preview_height: "500"
                };
                // create a new instance of the buildfire action Items
                ContentItem.linkEditor = new Buildfire.components.actionItems.sortableList("#actionItems");
                // this method will be called when a new item added to the list
                ContentItem.linkEditor.onAddItems = function (items) {
                    if (!ContentItem.item.data.links)
                        ContentItem.item.data.links = [];
                    ContentItem.item.data.links.push(items);
                    if (!$scope.$$phase)$scope.$digest();
                };
                // this method will be called when an item deleted from the list
                ContentItem.linkEditor.onDeleteItem = function (item, index) {
                    ContentItem.item.data.links.splice(index, 1);
                    if (!$scope.$$phase)$scope.$digest();
                };
                // this method will be called when you edit item details
                ContentItem.linkEditor.onItemChange = function (item, index) {
                    ContentItem.item.data.links.splice(index, 1, item);
                    if (!$scope.$$phase)$scope.$digest();
                };
                // this method will be called when you change the order of items
                ContentItem.linkEditor.onOrderChange = function (item, oldIndex, newIndex) {
                    var temp = ContentItem.item.data.links[oldIndex];
                    ContentItem.item.data.links[oldIndex] = ContentItem.item.data.links[newIndex];
                    ContentItem.item.data.links[newIndex] = temp;
                    if (!$scope.$$phase)$scope.$digest();
                };

                /**
                 * Initialize the carousel and links
                 */
                if (ContentItem.item.data.links)
                    ContentItem.linkEditor.loadItems(ContentItem.item.data.links);
                if (ContentItem.item.data.address && ContentItem.item.data.address.aName) {
                    ContentItem.currentAddress = ContentItem.item.data.address.aName;
                    ContentItem.currentCoordinates = [ContentItem.item.data.address.lng, ContentItem.item.data.address.lat];
                }

                /**
                 * This updateMasterItem will update the ContentMedia.masterItem with passed item
                 * @param item
                 */
                function updateMasterItem(item) {
                    ContentItem.masterItem = angular.copy(item);
                }

                /**
                 * This resetItem will reset the ContentMedia.item with ContentMedia.masterItem
                 */
                function resetItem() {
                    ContentItem.item = angular.copy(ContentItem.masterItem);
                }


                /**
                 * isUnChanged to check whether there is change in controller media item or not
                 * @param item
                 * @returns {*|boolean}
                 */
                function isUnChanged(item) {
                    return angular.equals(item, ContentItem.masterItem);
                }

                function insertAndUpdate(_item) {
                    updating = true;
                    if (_item.id) {
                        Items.update(_item.id, _item.data).then(function (data) {
                            updating = false;
                        }, function (err) {
                            updating = false;
                            //console.log('Error while updating data---', err);
                        });
                    }
                    else if (!isNewItemInserted) {
                        isNewItemInserted = true;
                        _item.data.rank = (placeInfoData.data.content.rankOfLastItemItems || 0) + 10;
                        _item.data.dateCreated = new Date();
                        Items.insert(_item.data).then(function (data) {
                            if (data && data.id) {
                                ContentItem.item.data.deepLinkUrl = Buildfire.deeplink.createLink({id: data.id});
                                ContentItem.item.id = data.id;
                                updateMasterItem(ContentItem.item);
                                placeInfoData.data.content.rankOfLastItemItems = _item.data.rank;
                                PlaceInfo.save(placeInfoData.data).then(function (data) {
                                    updating = false;
                                }, function (err) {
                                    updating = false;
                                });
                            }
                            else {
                                //isNewItemInserted = false;
                                updating = false;
                            }
                        }, function (err) {
                            //resetItem();
                            updating = false;
                            //isNewItemInserted = false;
                        });
                    }
                }

                /**
                 * updateItemsWithDelay called when ever there is some change in current media item
                 * @param _item
                 */
                function updateItemsWithDelay(_item) {
                    if (updating)
                        return;
                    if (tmrDelayForItem) {
                        $timeout.cancel(tmrDelayForItem);
                    }
                    ContentItem.isItemValid = isValidItem(ContentItem.item.data);
                    if (_item && !isUnChanged(_item) && ContentItem.isItemValid) {
                        tmrDelayForItem = $timeout(function () {
                            insertAndUpdate(_item);
                        }, 300);
                    }
                }

                //init();
                ContentItem.addListImage = function () {
                    var options = {showIcons: false, multiSelection: false},
                        listImgCB = function (error, result) {
                            if (error) {
                                console.error('Error:', error);
                            } else {
                                ContentItem.item.data.listImage = result.selectedFiles && result.selectedFiles[0] || null;
                                if (!$scope.$$phase)$scope.$digest();
                            }
                        };
                    Buildfire.imageLib.showDialog(options, listImgCB);
                };
                ContentItem.removeListImage = function () {
                    ContentItem.item.data.listImage = null;
                };
                /**
                 * done will close the single item view
                 */
                ContentItem.done = function () {
                    if ($routeParams.sectionId != 'allitems') {
                        Location.go('#/items/' + $routeParams.sectionId);
                    }
                    else {
                        Location.go('#/allitems')
                    }
                };
                ContentItem.setLocation = function (data) {
                    ContentItem.item.data.address = {
                        lng: data.coordinates[0],
                        lat: data.coordinates[1],
                        aName: data.location
                    };
                    ContentItem.currentAddress = data.location;
                    ContentItem.currentCoordinates = data.coordinates;
                    if (!$scope.$$phase)$scope.$digest();
                };
                ContentItem.setDraggedLocation = function (data) {
                    ContentItem.item.data.address = {
                        lng: data.coordinates[0],
                        lat: data.coordinates[1],
                        aName: data.location
                    };
                    ContentItem.currentAddress = data.location;
                    ContentItem.currentCoordinates = data.coordinates;
                    if (!$scope.$$phase)$scope.$digest();
                };
                ContentItem.setCoordinates = function () {
                    var latlng = '';
                    console.log('ng-enter---------------------called------------------', ContentItem.currentAddress);
                    function successCallback(resp) {
                        console.error('Successfully validated coordinates-----------', resp);
                        if (resp) {
                            ContentItem.item.data.address = {
                                lng: ContentItem.currentAddress.split(",")[1].trim(),
                                lat: ContentItem.currentAddress.split(",")[0].trim(),
                                aName: ContentItem.currentAddress
                            };
                            ContentItem.currentCoordinates = [ContentItem.currentAddress.split(",")[1].trim(), ContentItem.currentAddress.split(",")[0].trim()];
                        } else {
                            //errorCallback();
                        }
                    }

                    function errorCallback(err) {
                        console.error('Error while validating coordinates------------', err);
                        ContentItem.validCoordinatesFailure = true;
                        $timeout(function () {
                            ContentItem.validCoordinatesFailure = false;
                        }, 5000);
                    }

                    if (ContentItem.currentAddress) {
                        latlng = ContentItem.currentAddress.split(',')[1] + "," + ContentItem.currentAddress.split(',')[0]
                    }

                    Utils.validLongLats(latlng).then(successCallback, errorCallback);
                };
                ContentItem.clearData = function () {
                    if (!ContentItem.currentAddress) {
                        ContentItem.item.data.address = {
                            lng: '',
                            lat: '',
                            aName: ''
                        };
                        ContentItem.currentCoordinates = null;
                    }
                };

                ContentItem.validCopyAddressFailure = false;
                ContentItem.locationAutocompletePaste = function () {
                    function error() {
                        console.error('ERROOR emethpdd called');
                        ContentItem.validCopyAddressFailure = true;
                        $timeout(function () {
                            ContentItem.validCopyAddressFailure = false;
                        }, 5000);

                    }

                    $timeout(function () {
                        console.log('val>>>', $("#googleMapAutocomplete").val());
                        console.log('.pac-container .pac-item', $(".pac-container .pac-item").length);
                        if ($(".pac-container .pac-item").length) {
                            var firstResult = $(".pac-container .pac-item:first").find('.pac-matched').map(function () {
                                return $(this).text();
                            }).get().join(); // + ', ' + $(".pac-container .pac-item:first").find('span:last').text();
                            console.log('firstResult', firstResult);
                            var geocoder = new google.maps.Geocoder();
                            geocoder.geocode({"address": firstResult}, function (results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                    var lat = results[0].geometry.location.lat(),
                                        lng = results[0].geometry.location.lng();
                                    ContentItem.setLocation({location: firstResult, coordinates: [lng, lat]});
                                    $("#googleMapAutocomplete").blur();
                                }
                                else {
                                    console.error('' +
                                        'Error else parts of google');
                                    error();
                                }
                            });
                        }
                        else if (ContentItem.currentAddress && ContentItem.currentAddress.split(',').length) {
                            console.log('Location found---------------------', ContentItem.currentAddress.split(',').length, ContentItem.currentAddress.split(','));
                            ContentItem.setCoordinates();
                            /*var geocoder = new google.maps.Geocoder();
                            geocoder.geocode({
                                "latLng": {
                                    "lat": parseInt(ContentItem.currentAddress.split(',')[0]),
                                    "lng": parseInt(ContentItem.currentAddress.split(',')[1])
                                }
                            }, function (results, status) {
                                console.log('Got Address based on coordinates--------------------', results, status);
                                if (status == google.maps.GeocoderStatus.OK) {
                                 var lat = results[0].geometry.location.lat(),
                                 lng = results[0].geometry.location.lng();
                                 ContentItem.setLocation({location: ContentItem.currentAddress, coordinates: [lng, lat]});
                                 $("#googleMapAutocomplete").blur();
                                 }
                                 else {
                                 console.error('' +
                                 'Error else parts of google');
                                 error();
                                 }
                            });*/
                        }
                        else {
                            error();
                        }
                    }, 1000);

                };


                //to validate the item
                function isValidItem(item) {
                    return item.itemTitle;
                }


                if ($rootScope.dontPropagate == true)
                    $rootScope.dontPropagate = false;
                else
                    Messaging.sendMessageToWidget({
                        name: EVENTS.ROUTE_CHANGE,
                        message: {
                            path: PATHS.ITEM,
                            //id: ContentItem.item ? ContentItem.item.id : "",
                            id: $routeParams.itemId,
                            secId: $routeParams.sectionId
                        }
                    });

                $scope.$watch(function () {
                    return ContentItem.item;
                }, updateItemsWithDelay, true);
            }]);
})(window.angular, window.tinymce);
