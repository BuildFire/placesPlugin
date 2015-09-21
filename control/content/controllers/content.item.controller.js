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
        .controller('ContentItemCtrl', ['$scope', 'item', 'Buildfire', 'DB', 'COLLECTIONS', '$routeParams',
            function ($scope, item, Buildfire, DB, COLLECTIONS, $routeParams) {
                $scope.itemShow = 'Content';
                var ContentItem = this;
                if(item){
                    ContentItem.item=item;
                }
                else{
                    ContentItem.item={};
                }
                // create a new instance of the buildfire carousel editor
                var editor = new Buildfire.components.carousel.editor("#carousel");
                // this method will be called when a new item added to the list
                editor.onAddItems = function (items) {
                    if (!ContentItem.item.images)
                        ContentItem.item.images = [];
                    ContentItem.item.images.push.apply(ContentItem.item.images, items);
                    $scope.$digest();
                };
                // this method will be called when an item deleted from the list
                editor.onDeleteItem = function (item, index) {
                    ContentItem.item.images.splice(index, 1);
                    $scope.$digest();
                };
                // this method will be called when you edit item details
                editor.onItemChange = function (item, index) {
                    ContentItem.item.images.splice(index, 1, item);
                    $scope.$digest();
                };
                // this method will be called when you change the order of items
                editor.onOrderChange = function (item, oldIndex, newIndex) {
                    var temp = ContentItem.item.images[oldIndex];
                    ContentItem.item.images[oldIndex] = ContentItem.item.images[newIndex];
                    ContentItem.item.images[newIndex] = temp;
                    $scope.$digest();
                };
                // create a new instance of the buildfire action Items
                var linkEditor = new Buildfire.components.actionItems.sortableList("#actionItems");
                // this method will be called when a new item added to the list
                linkEditor.onAddItems = function (items) {
                    if (!ContentItem.item.links)
                        ContentItem.item.links = [];
                    ContentItem.item.links.push.apply(ContentItem.item.links, items);
                    $scope.$digest();
                };
                // this method will be called when an item deleted from the list
                linkEditor.onDeleteItem = function (item, index) {
                    ContentItem.item.links.splice(index, 1);
                    $scope.$digest();
                };
                // this method will be called when you edit item details
                linkEditor.onItemChange = function (item, index) {
                    ContentItem.item.links.splice(index, 1, item);
                    $scope.$digest();
                };
                // this method will be called when you change the order of items
                linkEditor.onOrderChange = function (item, oldIndex, newIndex) {
                    var temp = ContentItem.item.links[oldIndex];
                    ContentItem.item.links[oldIndex] = ContentItem.item.links[newIndex];
                    ContentItem.item.links[newIndex] = temp;
                    $scope.$digest();
                };
                /**
                 * Create instance of Items db collection
                 * @type {DB}
                 */
                var Items = new DB(COLLECTIONS.Items);

                var callback = function (error, result) {
                    if (error) {
                        console.error('Error:', error);
                    } else {
                        ContentItem.item.backgroundImage = result.selectedFiles && result.selectedFiles[0] || null;
                        $scope.$digest();
                    }
                };

                function updateLastSaved() {
                    ContentItem._lastSaved = angular.copy(ContentItem.item);
                }

                function init() {
                    if (item) {
                        ContentItem.item = item;
                    }
                    else
                        ContentItem.item = {
                            listImage: '',
                            itemTitle: 'Untitled',
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

                    updateLastSaved();
                }

                init();


                ContentItem.addBackgroundImage = function () {
                    Buildfire.imageLib.showDialog(options, callback);
                };
                ContentItem.removeBackgroundImage = function () {
                    ContentItem.item.backgroundImage = null;
                };
                $scope.$watch(function () {
                    return ContentItem.item;
                }, function () {
                    if (ContentItem.item.id) {
                        alert(2);
                        Buildfire.datastore.update(ContentItem.item.id, ContentItem.item.data, 'items', function (err, result) {

                            if(err){
                                ContentItem.item = angular.copy(ContentItem._lastSaved);
                            }
                            else{
                                updateLastSaved();
                            }

                        });
                        /* .then(function () {
                         updateLastSaved();
                         }, function () {
                         /!* revert to previous value in case of error*!/
                         ContentItem.mediaInfo = angular.copy(ContentItem._lastSaved);
                         });*/
                    }
                    else {
                        /*   Items.insert(ContentItem.item.data).then(function () {
                         updateLastSaved();
                         }, function () {
                         /!* revert to previous value in case of error*!/
                         ContentItem.mediaInfo = angular.copy(ContentItem._lastSaved);
                         });*/
                        alert(1);
                        Buildfire.datastore.insert(ContentItem.item, 'items', false, function (err, result) {
                            if (!err) {

                                ContentItem.item.id = result.id;
                                updateLastSaved();
                                /*Buildfire.datastore.getById(result.id, 'items', function (er, res) {
                                 if (!er) {
                                 ContentItem.item = res.data;
                                 ContentItem.item.id = res.id;
                                 updateLastSaved();
                                 }
                                 });*/

                            }
                            else
                                ContentItem.mediaInfo = angular.copy(ContentItem._lastSaved);
                        });
                    }
                }, true);

            }]);
})(window.angular, window.tinymce);