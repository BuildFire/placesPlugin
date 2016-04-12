/**
 * Create self executing function to avoid global scope creation
 */
(function (angular, tinymce,buildfire) {
    'use strict';
    angular.module('placesContent')
        .controller('ContentSectionCtrl', ['$scope', '$routeParams', 'DB', '$timeout', 'COLLECTIONS', 'Orders', 'OrdersItems', 'AppConfig', 'Messaging', 'EVENTS', 'PATHS', '$csv', 'Buildfire', 'Location', 'placesInfo', 'sectionInfo', 'DEFAULT_DATA','$rootScope',
            function ($scope, $routeParams, DB, $timeout, COLLECTIONS, Orders, OrdersItems, AppConfig, Messaging, EVENTS, PATHS, $csv, Buildfire, Location, placesInfo, sectionInfo, DEFAULT_DATA,$rootScope) {

                //Hide the INT header part.
                Buildfire.appearance.setHeaderVisibility(false);

                var isNewSectionInserted = false;

                //Scroll current view to top when page loaded.
                Buildfire.navigation.scrollTop();
                /**
                 * ContentSection._Sections is an instance of Sections db collection
                 * @type {DB}
                 *
                 * PlaceSettings will get the Place initialized settings
                 *
                 */
                var ContentSection = this
                    , tmrDelayForMedia = null
                    , selectImageOptions = {showIcons: false, multiSelection: false}
                    , PlaceInfo = new DB(COLLECTIONS.PlaceInfo)
                    , updating = false;

                var background = new Buildfire.components.images.thumbnail("#background");
                ContentSection._Sections = new DB(COLLECTIONS.Sections);
                var placeInfoData;
                if (placesInfo) {
                    placeInfoData = placesInfo;
                }
                else {
                    placeInfoData = DEFAULT_DATA.PLACE_INFO;
                }


                if (sectionInfo) {
                    ContentSection.section = sectionInfo;
                    updateMasterSection(ContentSection.section);
                }
                else {
                    ContentSection.section = DEFAULT_DATA.SECTION;
                    updateMasterSection(ContentSection.section);
                }

                if (ContentSection.section.data && ContentSection.section.data.itemListBGImage) {
                    background.loadbackground(ContentSection.section.data.itemListBGImage);
                }

                background.onChange = function (url) {
                    ContentSection.section.data.itemListBGImage = url;
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                };

                background.onDelete = function (url) {
                    ContentSection.section.data.itemListBGImage = "";
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                };
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


                function insertAndUpdate(_item) {
                    updating = true;
                    if (_item.id) {
                        console.info('****************Section exist***********************');
                        ContentSection._Sections.update(_item.id, _item.data).then(function (data) {
                            updating = false;
                            updateMasterSection(_item);
                        }, function (err) {
                            resetItem();
                            updating = false;
                            console.log('Error while updating data---', err);
                        });
                    }
                    else if(!isNewSectionInserted) {
                        isNewSectionInserted=true;
                        console.info('****************Section inserted***********************');
                        _item.data.rank = (placeInfoData.data.content.rankOfLastItem || 0) + 10;
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
                            isNewSectionInserted=false;
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
                        $timeout.cancel(tmrDelayForMedia);
                    }

                    ContentSection.isItemValid = isValidItem(ContentSection.section.data);
                    if (_section && !isUnChanged(_section) && ContentSection.isItemValid) {
                        tmrDelayForMedia = $timeout(function () {
                            insertAndUpdate(_section)
                        }, 500);
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
                            if (!$scope.$$phase)$scope.$digest();
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
                 * done will close the single item view
                 */
                ContentSection.done = function () {
                    Location.goToHome();
                };

                //to validate the section
                function isValidItem(item) {
                    return item.secTitle;
                }


                if($rootScope.dontPropagate == true)
                    $rootScope.dontPropagate = false;
                else
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
})(window.angular, window.tinymce, window.buildfire);