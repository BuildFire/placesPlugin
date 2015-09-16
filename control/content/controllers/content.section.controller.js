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
        .controller('ContentSectionCtrl', ['$scope', 'DB', '$timeout', 'COLLECTIONS', 'Orders', 'AppConfig', 'Messaging', 'EVENTS', 'PATHS', '$csv', 'Buildfire',
            function ($scope, DB, $timeout, COLLECTIONS, Orders, AppConfig, Messaging, EVENTS, PATHS, $csv, Buildfire) {

                var ContentSection = this;
                var tmrDelayForMedia = null;
                /**
                 * Create instance of Sections db collection
                 * @type {DB}
                 */
                var Sections = new DB(COLLECTIONS.Sections);

                /**
                 * Get the Place initialized settings
                 */
                var PlaceSettings = AppConfig.getSettings();
                console.log(PlaceSettings);
                /**
                 * Get the MediaCenter master collection data object id
                 */
                var appId = AppConfig.getAppId();
                console.log(appId);

                ContentSection.section = {
                    data: {
                        mainImage: '',
                        secTitle: '',
                        secSummary: '',
                        itemListBGImage: '',
                        sortBy: '',
                        rankOfLastItem: ''
                    }
                };
                ContentSection.masterSection = { data: {
                    mainImage: '',
                    secTitle: '',
                    secSummary: '',
                    itemListBGImage: '',
                    sortBy: '',
                    rankOfLastItem: ''
                }};
                var selectImageOptions = {showIcons: false, multiSelection: false};


                /**
                 * This updatemasterSection will update the ContentSection.section with passed item
                 * @param item
                 */
                function updateMasterSection(item) {
                    ContentSection.section = angular.copy(item);
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
                function updateItemData() {
                    Sections.update(ContentSection.section.id, ContentSection.section.data).then(function (data) {
                        updateMasterSection(ContentSection.section);
                    }, function (err) {
                        resetItem();
                        console.error('Error-------', err);
                    });
                }

                /**
                 * This addNewItem method will call the Builfire insert method to insert ContentMedia.item
                 */

                function addNewItem() {
                    Sections.insert(ContentSection.section.data).then(function (data) {
                        Sections.getById(data.id).then(function (item) {
                            ContentSection.section = item;
                            updateMasterSection(item);
                            PlaceSettings.content.rankOfLastItem = item.data.rank;
                            Sections.update(appId, PlaceSettings).then(function (data) {
                                console.info("Updated MediaCenter rank");
                            }, function (err) {
                                console.error('Error-------', err);
                            });
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
                 * @param item
                 */
                function updateItemsWithDelay(section) {
                    if (tmrDelayForMedia) {
                        clearTimeout(tmrDelayForMedia);
                    }
                    if (!isUnChanged(ContentSection.section)) {
                        tmrDelayForMedia = setTimeout(function () {
                            if (section.id) {
                                updateItemData();
                            }
                            else {
                                ContentSection.section.data.dateCreated = +new Date();
                                addNewItem();
                            }

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
                /**
                 * will delete the current item from MediaContent collection
                 */
                ContentSection.delete = function () {
                    console.log(ContentSection.item);
                    if (ContentSection.section.id) {
                        Sections.delete(ContentSection.section.id).then(function (data) {
                            Location.goToHome();
                        }, function (err) {
                            console.error('Error while deleting an item-----', err);
                        });
                    }
                };


                /**
                 * Watch on ContentMedia.item to see changes and call updateItemsWithDelay
                 */
                $scope.$watch(function () {
                    return ContentSection.section;
                }, updateItemsWithDelay, true);

            }]);
})(window.angular, window.tinymce);