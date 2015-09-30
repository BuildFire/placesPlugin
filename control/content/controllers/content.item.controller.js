/**
 * Create self executing function to avoid global scope creation
 */
(function (angular, tinymce) {
    'use strict';
    angular
        .module('placesContent')
    /**
     * Inject dependency
     */
        .controller('ContentItemCtrl', ['$scope', 'item', 'Buildfire', 'DB', 'COLLECTIONS', '$routeParams', 'Location', 'Utils', '$timeout','EVENTS','PATHS','Messaging',
            function ($scope, item, Buildfire, DB, COLLECTIONS, $routeParams, Location, Utils, $timeout,EVENTS,PATHS,Messaging) {
                $scope.itemShow = 'Content';
                var ContentItem = this;
                var tmrDelayForItem = null;
                ContentItem.currentAddress = null;
                ContentItem.validCoordinatesFailure = false;
                ContentItem.currentCoordinates = null;

                function init() {
                    var data = {
                        listImage: '',
                        itemTitle: '',
                        images: [],
                        summary: '',
                        bodyContent: '',
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
                    if (item) {
                        updateMasterItem(item);
                        ContentItem.item = item;
                        if (item.data && item.data.address && item.data.address.aName) {
                            ContentItem.currentAddress = item.data.address.aName;
                            ContentItem.currentCoordinates = [item.data.address.lng, item.data.address.lat];
                        }
                    }
                    else {
                        updateMasterItem({data: data});
                        ContentItem.item = {
                            data: data
                        };
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

                // initialize carousel data
                if (ContentItem.item && ContentItem.item.data) {
                    ContentItem.editor = new Buildfire.components.carousel.editor("#carousel");
                    ContentItem.linkEditor = new Buildfire.components.actionItems.sortableList("#actionItems");
                    if (ContentItem.item.data.images) {
                        ContentItem.editor.loadItems(ContentItem.item.data.images);
                    }
                    else
                        ContentItem.editor.loadItems([]);
                    if (ContentItem.item.data.links)
                        ContentItem.linkEditor.loadItems(ContentItem.item.data.links);
                    else
                        ContentItem.linkEditor.loadItems([]);
                }

                /**
                 * Create instance of Items db collection
                 * @type {DB}
                 */
                var Items = new DB(COLLECTIONS.Items);

                var bgImgCB = function (error, result) {
                    if (error) {
                        console.error('Error:', error);
                    } else {
                        ContentItem.item.data.backgroundImage = result.selectedFiles && result.selectedFiles[0] || null;
                        $scope.$digest();
                    }
                };
                var listImgCB = function (error, result) {
                    if (error) {
                        console.error('Error:', error);
                    } else {
                        ContentItem.item.data.listImage = result.selectedFiles && result.selectedFiles[0] || null;
                        $scope.$digest();
                    }
                };
                var options = {showIcons: false, multiSelection: false};
                ContentItem.addBackgroundImage = function () {
                    Buildfire.imageLib.showDialog(options, bgImgCB);
                };
                ContentItem.removeBackgroundImage = function () {
                    ContentItem.item.data.backgroundImage = null;
                };
                ContentItem.addListImage = function () {
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


                /*Default BootStrapping and auto save block start*/


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
                 * filter to remove the body from copied data
                 * @param item
                 * @returns {XMLList|XML|*}
                 */
                function filter(item) {
                    var newItem = angular.copy(item);
                    newItem.data.bodyContent = '';
                    return newItem;
                }

                /**
                 * isUnChanged to check whether there is change in controller media item or not
                 * @param item
                 * @returns {*|boolean}
                 */
                function isUnChanged(item) {
                    if (item.data.bodyContent && tinymce.editors[0] && angular.equals(tinymce.editors[0].getContent({format: 'text'}).trim(), "")) {
                        return angular.equals(filter(item), ContentItem.masterItem);
                    }
                    else {
                        return angular.equals(item, ContentItem.masterItem);
                    }
                }

                function insertAndUpdate() {
                    if (ContentItem.item.id) {
                        console.log('Item exist----');
                        Items.update(ContentItem.item.id, ContentItem.item.data).then(function (data) {
                            console.log('Data updated successfully---', data);
                        }, function (err) {
                            console.log('Error while updating data---', err);
                        });
                    }
                    else {
                        Items.insert(ContentItem.item.data).then(function (data) {
                            console.log('Success---', data);
                            ContentItem.item.id = data.id;
                        }, function (err) {
                            console.log('Error---', err);
                        });
                        console.log('insert new item');
                    }
                }

                /**
                 * updateItemsWithDelay called when ever there is some change in current media item
                 * @param item
                 */
                function updateItemsWithDelay() {
                    if (tmrDelayForItem) {
                        clearTimeout(tmrDelayForItem);
                    }
                    if (ContentItem.item && !isUnChanged(ContentItem.item)) {
                        tmrDelayForItem = setTimeout(function () {
                            insertAndUpdate();
                        }, 1000);
                    }
                }

                init();


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
                        id:ContentItem.item? ContentItem.item.id : ""
                    }
                });

                $scope.$watch(function () {
                    return ContentItem.item;
                }, updateItemsWithDelay, true);
            }]);
})(window.angular, window.tinymce);