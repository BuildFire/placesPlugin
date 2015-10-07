/**
 * Create self executing function to avoid global scope creation
 */
(function (angular, tinymce) {
    'use strict';
    angular.module('placesContent')
        .controller('ContentSectionCtrl', ['$scope', '$routeParams', 'DB', '$timeout', 'COLLECTIONS', 'Orders', 'OrdersItems', 'AppConfig', 'Messaging', 'EVENTS', 'PATHS', '$csv', 'Buildfire', 'Location',
            function ($scope, $routeParams, DB, $timeout, COLLECTIONS, Orders, OrdersItems, AppConfig, Messaging, EVENTS, PATHS, $csv, Buildfire, Location) {
                /**
                 * Sections is an instance of Sections db collection
                 * @type {DB}
                 *
                 * PlaceSettings will get the Place initialized settings
                 *
                 */
                var ContentSection = this
                    , tmrDelayForMedia = null
                    , Sections = new DB(COLLECTIONS.Sections)
                    , _sectionData = {
                        data: {
                            mainImage: '',
                            secTitle: '',
                            secSummary: '',
                            itemListBGImage: '',
                            sortBy: '',
                            rankOfLastItem: ''
                        }
                    }
                    , selectImageOptions = {showIcons: false, multiSelection: false}
                    , PlaceInfo = new DB(COLLECTIONS.PlaceInfo)
                    , placeInfoData = {
                        data: {
                            content: {
                                images: [],
                                descriptionHTML: '',
                                description: '<p>&nbsp;<br></p>',
                                sortBy: Orders.ordersMap.Newest,
                                rankOfLastItem: '',
                                sortByItems: OrdersItems.ordersMap.Newest
                            },
                            design: {
                                secListLayout: "sec-list-1-1",
                                mapLayout: "map-1",
                                itemListLayout: "item-list-1",
                                itemDetailsLayout: "item-details-1",
                                secListBGImage: ""
                            },
                            settings: {
                                defaultView: "list",
                                showDistanceIn: "miles"
                            }
                        }
                    };


                ContentSection.section = angular.copy(_sectionData);
                ContentSection.masterSection = null;

                function updateMasterSection(item) {
                    ContentSection.masterSection = angular.copy(item);
                }

                /**
                 * This resetItem will reset the ContentSection.section with ContentSection.masterSection
                 */
                function resetItem() {
                    ContentSection.section = angular.copy(ContentSection.masterSection);
                }

                function init() {
                    var success = function (result) {
                            console.info('Init placeInfoData success result:', result);
                            if (Object.keys(result.data).length > 0) {
                                placeInfoData = result;
                            }
                        }
                        , error = function (err) {
                            console.error('Error while getting data', err);
                        };
                    PlaceInfo.get().then(success, error);
                }


                /**
                 * isUnChanged to check whether there is change in controller section or not
                 * @param item
                 * @returns {*|boolean}
                 */
                function isUnChanged(item) {
                    return angular.equals(item, ContentSection.masterSection);
                }

                /**
                 * This updateItemData method will call the Builfire update method to update the ContentMedia.item
                 */
                function updateItemData(_section) {
                    Sections.update(_section.id, _section.data).then(function (data) {
                        updateMasterSection(_section);
                    }, function (err) {
                        resetItem();
                        console.error('Error-------', err);
                    });
                }

                /**
                 * This addNewItem method will call the Builfire insert method to insert ContentMedia.item
                 */

                function addNewItem(_section) {
                    Sections.insert(_section.data).then(function (item) {
                        ContentSection.section = item;
                        updateMasterSection(item);
                        placeInfoData.data.content.rankOfLastItem = item.data.rank;
                        PlaceInfo.save(placeInfoData.data).then(function (data) {
                            console.info("Updated MediaCenter rank");
                        }, function (err) {
                            resetItem();
                            console.error('Error while getting----------', err);
                        });
                    }, function (err) {
                        console.error('---------------Error while inserting data------------', err);
                    });
                }


                /**
                 * updateItemsWithDelay called when ever there is some change in current section
                 * @param _section
                 */
                function updateItemsWithDelay(_section) {
                    if (tmrDelayForMedia) {
                        clearTimeout(tmrDelayForMedia);
                    }
                    if (!isUnChanged(_section)) {
                        tmrDelayForMedia = setTimeout(function () {
                            if (_section.id) {
                                updateItemData(_section);
                            }
                            else {
                                _section.data.rank = (placeInfoData.data.content.rankOfLastItem || 0) + 10;
                                _section.data.dateCreated = +new Date();
                                addNewItem(_section);
                            }
                        }, 1000);
                    }
                }

                updateMasterSection(ContentSection.section);

                init();

                if ($routeParams.sectionId) {
                    Sections.getById($routeParams.sectionId).then(function (result) {
                            if (result && result.data) {
                                ContentSection.section = result;
                            }
                            else {
                                Location.goToHome();
                            }
                        },
                        function fail() {
                            Location.goToHome();
                        }
                    );
                }
                /**
                 * callback function of Main image icon selection click
                 */
                ContentSection.selectMainImage = function () {
                    Buildfire.imageLib.showDialog(selectImageOptions, function (error, result) {
                        if (error) {
                            return console.error('Error:', error);
                        }
                        if (result.selectedFiles && result.selectedFiles.length) {
                            ContentSection.section.data.mainImage = result.selectedFiles[0];
                            $scope.$digest();
                        }
                    });
                };

                /**
                 * Will remove the main image url
                 */
                ContentSection.removeMainImage = function () {
                    ContentSection.section.data.mainImage = '';
                };

                /**
                 * callback function of List BG image icon selection click
                 */
                ContentSection.selectListBGImage = function () {
                    Buildfire.imageLib.showDialog(selectImageOptions, function (error, result) {
                        if (error) {
                            return console.error('Error:', error);
                        }
                        if (result.selectedFiles && result.selectedFiles.length) {
                            ContentSection.section.data.itemListBGImage = result.selectedFiles[0];
                            $scope.$digest();
                        }
                    });
                };

                /**
                 * Will remove the List BG image url
                 */
                ContentSection.removeListBGImage = function () {
                    ContentSection.section.data.itemListBGImage = '';
                };

                /**
                 * done will close the single item view
                 */
                ContentSection.done = function () {
                    Location.goToHome();
                };

                /**
                 * will delete the current item from MediaContent collection
                 */
                ContentSection.delete = function () {
                    if (ContentSection.section.id) {
                        Sections.delete(ContentSection.section.id).then(function (data) {
                            Location.goToHome();
                        }, function (err) {
                            console.error('Error while deleting an item-----', err);
                        });
                    }
                };

                //syn with widget
                Messaging.sendMessageToWidget({
                    name: EVENTS.ROUTE_CHANGE,
                    message: {
                        path: PATHS.SECTION,
                        id: ContentSection.section ? ContentSection.section.id : ""
                    }
                });

                $scope.$watch(function () {
                    return ContentSection.section;
                }, updateItemsWithDelay, true);
            }]);
})(window.angular, window.tinymce);