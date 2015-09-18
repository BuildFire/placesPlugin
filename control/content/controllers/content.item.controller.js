/**
 * Create self executing funton to avoid global scope creation
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
                var options = {showIcons: false, multiSelection: false};

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