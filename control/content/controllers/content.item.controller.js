/**
 * Create self executing function to avoid global scope creation
 */
(function (angular, tinymce) {
    'use strict';
    angular
        .module('placesContent')
        .controller('ContentItemCtrl', ['$scope', 'Buildfire', 'DB', 'COLLECTIONS', '$routeParams', 'Location', 'Utils', '$timeout', 'EVENTS', 'PATHS', 'Messaging',
            function ($scope, Buildfire, DB, COLLECTIONS, $routeParams, Location, Utils, $timeout, EVENTS, PATHS, Messaging) {

                var tmrDelayForItem = null
                    , Items = new DB(COLLECTIONS.Items)
                    , _data = {
                        listImage: '',
                        itemTitle: '',
                        images: [],
                        summary: '',
                        bodyContent: '<p>&nbsp;<br></p>',
                        bodyContentHTML: '',
                        addressTitle: '',
                        sections: [$routeParams.sectionId],
                        address: {
                            lat: '',
                            lng: '',
                            aName: ''
                        },
                        links: [],
                        backgroundImage: ''
                    };

                $scope.itemShow = 'Content';

                var ContentItem = this;
                ContentItem.currentAddress = null;
                ContentItem.validCoordinatesFailure = false;
                ContentItem.currentCoordinates = null;
                ContentItem.item = angular.copy({data: _data});
                ContentItem.masterItem = angular.copy(ContentItem.item);

                function init() {
                    if ($routeParams.itemId) {
                        Items.getById($routeParams.itemId).then(function success(result) {
                                if (result && result.data) {
                                    ContentItem.item = result;
                                    updateMasterItem(ContentItem.item);
                                }
                                if (ContentItem.item.data.images)
                                    ContentItem.editor.loadItems(ContentItem.item.data.images);
                                if (ContentItem.item.data.links)
                                    ContentItem.linkEditor.loadItems(ContentItem.item.data.links);
                                if (ContentItem.item.data.address && ContentItem.item.data.address.aName) {
                                    ContentItem.currentAddress = ContentItem.item.data.address.aName;
                                    ContentItem.currentCoordinates = [ContentItem.item.data.address.lng, ContentItem.item.data.address.lat];
                                }
                            },
                            function fail(err) {
                                console.log('Error', err);
                            }
                        );
                    }
                }

                //option for wysiwyg
                ContentItem.bodyWYSIWYGOptions = {
                    plugins: 'advlist autolink link image lists charmap print preview',
                    skin: 'lightgray',
                    trusted: true,
                    theme: 'modern'
                };
                // create a new instance of the buildfire carousel editor
                ContentItem.editor = new Buildfire.components.carousel.editor("#carousel");
                // this method will be called when a new item added to the list
                ContentItem.editor.onAddItems = function (items) {
                    if (!ContentItem.item.data.images)
                        ContentItem.item.data.images = [];
                    ContentItem.item.data.images.push.apply(ContentItem.item.data.images, items);
                    $scope.$digest();
                };
                // this method will be called when an item deleted from the list
                ContentItem.editor.onDeleteItem = function (item, index) {
                    ContentItem.item.data.images.splice(index, 1);
                    $scope.$digest();
                };
                // this method will be called when you edit item details
                ContentItem.editor.onItemChange = function (item, index) {
                    ContentItem.item.data.images.splice(index, 1, item);
                    $scope.$digest();
                };
                // this method will be called when you change the order of items
                ContentItem.editor.onOrderChange = function (item, oldIndex, newIndex) {
                    var temp = ContentItem.item.data.images[oldIndex];
                    ContentItem.item.data.images[oldIndex] = ContentItem.item.data.images[newIndex];
                    ContentItem.item.data.images[newIndex] = temp;
                    $scope.$digest();
                };
                // create a new instance of the buildfire action Items
                ContentItem.linkEditor = new Buildfire.components.actionItems.sortableList("#actionItems");
                // this method will be called when a new item added to the list
                ContentItem.linkEditor.onAddItems = function (items) {
                    if (!ContentItem.item.data.links)
                        ContentItem.item.data.links = [];
                    ContentItem.item.data.links.push(items);
                    $scope.$digest();
                };
                // this method will be called when an item deleted from the list
                ContentItem.linkEditor.onDeleteItem = function (item, index) {
                    ContentItem.item.data.links.splice(index, 1);
                    $scope.$digest();
                };
                // this method will be called when you edit item details
                ContentItem.linkEditor.onItemChange = function (item, index) {
                    ContentItem.item.data.links.splice(index, 1, item);
                    $scope.$digest();
                };
                // this method will be called when you change the order of items
                ContentItem.linkEditor.onOrderChange = function (item, oldIndex, newIndex) {
                    var temp = ContentItem.item.data.links[oldIndex];
                    ContentItem.item.data.links[oldIndex] = ContentItem.item.data.links[newIndex];
                    ContentItem.item.data.links[newIndex] = temp;
                    $scope.$digest();
                };

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
                    if (_item.id) {
                        console.info('****************Item exist***********************');
                        Items.update(_item.id, _item.data).then(function (data) {
                            console.log('Data updated successfully---', data);
                        }, function (err) {
                            console.log('Error while updating data---', err);
                        });
                    }
                    else {
                        console.info('****************Item inserted***********************');
                        _item.data.deepLinkUrl = Buildfire.deeplink.createLink({id: _item.id});
                        _item.data.dateCreated = new Date();
                        Items.insert(_item.data).then(function (data) {
                            ContentItem.item.id = data.id;
                            updateMasterItem(ContentItem.item);
                        }, function (err) {
                            console.log('Error---', err);
                        });
                    }
                }

                /**
                 * updateItemsWithDelay called when ever there is some change in current media item
                 * @param _item
                 */
                function updateItemsWithDelay(_item) {
                    if (tmrDelayForItem) {
                        clearTimeout(tmrDelayForItem);
                    }
                    if (_item && !isUnChanged(_item)) {
                        tmrDelayForItem = setTimeout(function () {
                            insertAndUpdate(_item);
                        }, 1000);
                    }
                }

                init();

                ContentItem.addBackgroundImage = function () {
                    var options = {showIcons: false, multiSelection: false}
                        , callback = function (error, result) {
                            if (error) {
                                console.error('Error:', error);
                            } else {
                                ContentItem.item.data.backgroundImage = result.selectedFiles && result.selectedFiles[0] || null;
                                $scope.$digest();
                            }
                        };
                    Buildfire.imageLib.showDialog(options, callback);
                };
                ContentItem.removeBackgroundImage = function () {
                    ContentItem.item.data.backgroundImage = null;
                };
                ContentItem.addListImage = function () {
                    var options = {showIcons: false, multiSelection: false};
                    Buildfire.imageLib.showDialog(options, listImgCB);
                };
                ContentItem.removeListImage = function () {
                    ContentItem.item.data.listImage = null;
                };
                /**
                 * done will close the single item view
                 */
                ContentItem.done = function () {
                    Location.go('#/items/' + $routeParams.sectionId);
                };
                ContentItem.setLocation = function (data) {
                    ContentItem.item.data.address = {
                        lng: data.coordinates[0],
                        lat: data.coordinates[1],
                        aName: data.location
                    };
                    ContentItem.currentAddress = data.location;
                    ContentItem.currentCoordinates = data.coordinates;
                    $scope.$digest();
                };
                ContentItem.setDraggedLocation = function (data) {
                    ContentItem.item.data.address = {
                        lng: data.coordinates[0],
                        lat: data.coordinates[1],
                        aName: data.location
                    };
                    ContentItem.currentAddress = data.location;
                    ContentItem.currentCoordinates = data.coordinates;
                    $scope.$digest();
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

                //syn with widget
                Messaging.sendMessageToWidget({
                    name: EVENTS.ROUTE_CHANGE,
                    message: {
                        path: PATHS.ITEM,
                        id: ContentItem.item ? ContentItem.item.id : ""
                    }
                });

                $scope.$watch(function () {
                    return ContentItem.item;
                }, updateItemsWithDelay, true);
            }]);
})(window.angular, window.tinymce);