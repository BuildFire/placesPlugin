/**
 * Create self executing function to avoid global scope creation
 */
(function (angular, tinymce, buildfire) {
    'use strict';
    angular
        .module('placesContent')
        .controller('ContentItemCtrl', ['$scope', 'Buildfire', 'DB', 'COLLECTIONS', '$routeParams', 'Location', 'Utils', '$timeout', 'EVENTS', 'PATHS', 'Messaging', 'item', 'placesInfo', 'DEFAULT_DATA','$rootScope',
            function ($scope, Buildfire, DB, COLLECTIONS, $routeParams, Location, Utils, $timeout, EVENTS, PATHS, Messaging, item, placesInfo, DEFAULT_DATA,$rootScope) {

                //Hide the INT header part.
                Buildfire.appearance.setHeaderVisibility(false);
                var isNewItemInserted = false;

                //Scroll current view to top when page loaded.
                buildfire.navigation.scrollTop();

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
                    theme: 'modern'
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
                    console.log('4 New Item Inserted--------------------------------------------_item--',_item);
                    updating = true;
                    if (_item.id) {
                        console.log('5 if (_item.id) {--------------------------------------------_item--',_item);
                        Items.update(_item.id, _item.data).then(function (data) {
                            console.log('6 Updated--------------------------------------------data--',data);
                            updating = false;
                        }, function (err) {
                            console.error('7 Updated- Error-------------------------------------------err--',err);
                            updating = false;
                            //console.log('Error while updating data---', err);
                        });
                    }
                    else if(!isNewItemInserted){
                        console.log('8 New Item-----------------------isNewItemInserted----------------data--',isNewItemInserted);

                        isNewItemInserted = true;
                        _item.data.rank = (placeInfoData.data.content.rankOfLastItemItems || 0) + 10;
                        _item.data.dateCreated = new Date();
                        Items.insert(_item.data).then(function (data) {
                            console.log('9 ----------- New Item Inserted--------------------------------------------',data);
                            if (data && data.id) {
                                console.log('10 New Item Inserted--------------------------------------------data--',data);
                                ContentItem.item.data.deepLinkUrl = Buildfire.deeplink.createLink({id: data.id});
                                ContentItem.item.id = data.id;
                                updateMasterItem(ContentItem.item);
                                console.log('11 New Item Inserted--------------------------------------------data--',data);
                                placeInfoData.data.content.rankOfLastItemItems = _item.data.rank;
                                PlaceInfo.save(placeInfoData.data).then(function (data) {
                                    console.log('12 Place Info Save Inserted--------------------------------------------data--',data);
                                    updating = false;
                                }, function (err) {
                                    console.error('13 Place Info Save Inserted--------------------------------------------data--',err);
                                    updating = false;
                                });
                            }
                            else {
                                console.log('14 Inserted Successs without ID --------------------------------------------data--',data);

                                //isNewItemInserted = false;
                                updating = false;
                            }
                        }, function (err) {
                            console.error('15  Inserted Error--------------------------------------------err--',err);
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
                    console.log('1 New Item Inserted--------------------------------------------updating--',updating);
                    if (updating)
                        return;
                    if (tmrDelayForItem) {
                       $timeout.cancel(tmrDelayForItem);
                    }
                    console.log('2 New Item Inserted--------------------------------------------updating--',updating);
                    ContentItem.isItemValid = isValidItem(ContentItem.item.data);
                    if (_item && !isUnChanged(_item) && ContentItem.isItemValid) {
                        tmrDelayForItem = $timeout(function () {
                            console.log('3 New Item Inserted--------------------------------------------updating--',updating);
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
                    function successCallback(resp) {
                        if (resp) {
                            ContentItem.item.data.address = {
                                lng: ContentItem.currentAddress.split(",")[0].trim(),
                                lat: ContentItem.currentAddress.split(",")[1].trim(),
                                aName: ContentItem.currentAddress
                            };
                            ContentItem.currentCoordinates = [ContentItem.currentAddress.split(",")[0].trim(), ContentItem.currentAddress.split(",")[1].trim()];
                        } else {
                            errorCallback();
                        }
                    }

                    function errorCallback(err) {
                        ContentItem.validCoordinatesFailure = true;
                        $timeout(function () {
                            ContentItem.validCoordinatesFailure = false;
                        }, 5000);
                    }

                    Utils.validLongLats(ContentItem.currentAddress).then(successCallback, errorCallback);
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
                        ContentItem.validCopyAddressFailure = true;
                        $timeout(function () {
                            ContentItem.validCopyAddressFailure = false;
                        }, 5000);

                    }
                    $timeout(function () {
                        console.log('val>>>',$("#googleMapAutocomplete").val());
                        console.log('.pac-container .pac-item',$(".pac-container .pac-item").length);
                        if ($(".pac-container .pac-item").length) {
                            var firstResult = $(".pac-container .pac-item:first").find('.pac-matched').text() + ', ' + $(".pac-container .pac-item:first").find('span:last').text();
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
                                    error();
                                }
                            });
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


                if($rootScope.dontPropagate == true)
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
})(window.angular, window.tinymce, window.buildfire);
