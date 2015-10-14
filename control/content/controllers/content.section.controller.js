/**
 * Create self executing function to avoid global scope creation
 */
(function (angular, tinymce) {
    'use strict';
    angular.module('placesContent')
        .controller('ContentSectionCtrl', ['$scope', '$routeParams', 'DB', '$timeout', 'COLLECTIONS', 'Orders', 'OrdersItems', 'AppConfig', 'Messaging', 'EVENTS', 'PATHS', '$csv', 'Buildfire', 'Location', 'placesInfo', 'sectionInfo',
            function ($scope, $routeParams, DB, $timeout, COLLECTIONS, Orders, OrdersItems, AppConfig, Messaging, EVENTS, PATHS, $csv, Buildfire, Location, placesInfo, sectionInfo) {
                /**
                 * ContentSection._Sections is an instance of Sections db collection
                 * @type {DB}
                 *
                 * PlaceSettings will get the Place initialized settings
                 *
                 */
                var ContentSection = this
                    , tmrDelayForMedia = null
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
                    , updating = false
                    , _placeInfoData = {
                        data: {
                            content: {
                                images: [],
                                descriptionHTML: '<p>&nbsp;<br></p>',
                                description: '<p>&nbsp;<br></p>',
                                sortBy: Orders.ordersMap.Manually,
                                rankOfLastItem: '',
                                sortByItems: OrdersItems.ordersMap.Newest,
                                showAllItems: 'true'
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
                ContentSection._Sections = new DB(COLLECTIONS.Sections);
                var placeInfoData;
                if (placesInfo) {
                    placeInfoData = placesInfo;
                }
                else {
                    placeInfoData = _placeInfoData;
                }


                if (sectionInfo) {
                    ContentSection.section = sectionInfo;
                    updateMasterSection(ContentSection.section);
                }
                else {
                    ContentSection.section = _sectionData;
                    updateMasterSection(ContentSection.section);
                }
                function updateMasterSection(item) {
                    ContentSection.masterSection = angular.copy(item);
                }

                /**
                 * This resetItem will reset the ContentSection.section with ContentSection.masterSection
                 */
                function resetItem() {
                    ContentSection.section = angular.copy(ContentSection.masterSection);
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
                    ContentSection._Sections.update(_section.id, _section.data).then(function (data) {
                        updating = false;
                        updateMasterSection(_section);
                    }, function (err) {
                        updating = false;
                        resetItem();
                        console.error('Error-------', err);
                    });
                }

                /**
                 * This addNewItem method will call the Builfire insert method to insert ContentMedia.item
                 */

                function addNewItem(_section) {
                    ContentSection._Sections.insert(_section.data).then(function (item) {
                        ContentSection.section.id = item.id;
                        ContentSection.section.data.deepLinkUrl = Buildfire.deeplink.createLink({id: item.id});
                        updateMasterSection(item);
                        placeInfoData.data.content.rankOfLastItem = item.data.rank;
                        updating = false;
                        PlaceInfo.save(placeInfoData.data).then(function (data) {
                        }, function (err) {
                            resetItem();
                            console.error('Error while getting----------', err);
                        });
                    }, function (err) {
                        updating = false;
                        console.error('---------------Error while inserting data------------', err);
                    });
                }


                function insertAndUpdate(_item) {
                    updating = true;
                    if (_item.id) {
                        console.info('****************Section exist***********************');
                        ContentSection._Sections.update(_item.id, _item.data).then(function (data) {
                            updating = false;
                            updateMasterSection(_section);
                        }, function (err) {
                            resetItem();
                            updating = false;
                            console.log('Error while updating data---', err);
                        });
                    }
                    else {
                        console.info('****************Section inserted***********************');
                        _item.data.dateCreated = new Date();
                        ContentSection._Sections.insert(_item.data).then(function (item) {
                            ContentSection.section.id = item.id;
                            ContentSection.section.data.deepLinkUrl = Buildfire.deeplink.createLink({id: item.id});
                            updateMasterSection(item);
                            placeInfoData.data.content.rankOfLastItem = item.data.rank;
                            updating = false;
                            PlaceInfo.save(placeInfoData.data).then(function (data) {
                            }, function (err) {
                                resetItem();
                                console.error('Error while getting----------', err);
                            });
                        }, function (err) {
                            resetItem();
                            updating = false;
                            console.log('Error---', err);
                        });
                    }
                }


                /**
                 * updateItemsWithDelay called when ever there is some change in current section
                 * @param _section
                 */
                function updateItemsWithDelay(_section) {
                    if (updating) {
                        return;
                    }
                    if (tmrDelayForMedia) {
                        clearTimeout(tmrDelayForMedia);
                    }
                    if (_section && !isUnChanged(_section)) {
                        tmrDelayForMedia = setTimeout(function () {
                            /* if (_section.id) {
                             updateItemData(_section);
                             }
                             else {
                             _section.data.rank = (placeInfoData.data.content.rankOfLastItem || 0) + 10;
                             _section.data.dateCreated = +new Date();
                             addNewItem(_section);
                             }*/
                            insertAndUpdate(_section)
                        }, 1000);
                    }
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

                //syn with widget
                Messaging.sendMessageToWidget({
                    name: EVENTS.ROUTE_CHANGE,
                    message: {
                        path: PATHS.HOME
                    }
                });

                $scope.$watch(function () {
                    return ContentSection.section;
                }, updateItemsWithDelay, true);
            }]);
})(window.angular, window.tinymce);