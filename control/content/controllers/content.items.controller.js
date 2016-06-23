/**
 * Create self executing funton to avoid global scope creation
 */
(function (angular, tinymce, buildfire) {
    'use strict';
    angular
        .module('placesContent')
    /**
     * Inject dependency
     */
        .controller('ContentItemsCtrl', ['$scope', '$routeParams', 'Buildfire', 'DB', 'COLLECTIONS', 'Modals', 'Orders', 'OrdersItems', 'Messaging', 'EVENTS', 'PATHS', 'Location', 'placesInfo', 'sectionInfo', 'DEFAULT_DATA', '$rootScope',
            function ($scope, $routeParams, Buildfire, DB, COLLECTIONS, Modals, Orders, OrdersItems, Messaging, EVENTS, PATHS, Location, placesInfo, sectionInfo, DEFAULT_DATA, $rootScope) {

                //Show the INT header part.
                Buildfire.appearance.setHeaderVisibility(true);


                //Scroll current view to top when page loaded.
                buildfire.navigation.scrollTop();
                /**
                 * Create instance of Sections,PlaceInfo and Items db collection
                 * @type {DB}
                 */
                var searchOptions;
                var ContentItems = this;
                ContentItems.Sections = new DB(COLLECTIONS.Sections);
                ContentItems.Items = new DB(COLLECTIONS.Items);
                ContentItems.PlaceInfo = new DB(COLLECTIONS.PlaceInfo);
                var tmrDelayForInfo = null
                    , _skip = 0
                    , _limit = 10
                    , _maxLimit = 19;

                if (sectionInfo != 'allitems')
                    ContentItems.sectionInfo = sectionInfo;
                if (placesInfo) {
                    updateMasterInfoData(placesInfo);
                    ContentItems.info = placesInfo;
                } else {
                    updateMasterInfoData(DEFAULT_DATA.PLACE_INFO);
                    ContentItems.info = angular.copy(DEFAULT_DATA.PLACE_INFO);
                }
                if ($routeParams.sectionId) {
                    if ($rootScope.popped)
                        $rootScope.popped = false;
                    ContentItems.section = $routeParams.sectionId;
                }
                else {
                    if ($rootScope.popped)
                        $rootScope.popped = false;
                    ContentItems.section = 'allitems';
                }
                ContentItems.isBusy = false;
                ContentItems.items = null;
                //ContentItems.masterInfoData = null;
                ContentItems.sortOptions = OrdersItems.options;
                ContentItems.itemSortableOptions = {
                    handle: '> .cursor-grab',
                    disabled: !(ContentItems.info.data.content.sortByItems === Orders.ordersMap.Manually),
                    stop: function (e, ui) {

                        var endIndex = ui.item.sortable.dropindex,
                            maxRank = 0,
                            draggedItem = ContentItems.items[endIndex];
                        if (draggedItem) {
                            var prev = ContentItems.items[endIndex - 1],
                                next = ContentItems.items[endIndex + 1];
                            var isRankChanged = false;
                            if (next) {
                                if (prev) {
                                    draggedItem.data.rank = ((prev.data.rank || 0) + (next.data.rank || 0)) / 2;
                                    isRankChanged = true;
                                } else {
                                    draggedItem.data.rank = (next.data.rank || 0) / 2;
                                    isRankChanged = true;
                                }
                            } else {
                                if (prev) {
                                    draggedItem.data.rank = (((prev.data.rank || 0) * 2) + 10) / 2;
                                    maxRank = draggedItem.data.rank;
                                    isRankChanged = true;
                                }
                            }
                            if (isRankChanged) {
                                console.log('update in index');
                                ContentItems.Items.update(draggedItem.id, draggedItem.data).then(function (updataeditem) {
                                    console.log('Updated item--------------------------------', updataeditem);
                                    if (ContentItems.sectionInfo) {
                                        ContentItems.sectionInfo.data.rankOfLastItem = maxRank;
                                        // Update the rankOfLastItem in a particular section
                                        ContentItems.Sections.update(ContentItems.sectionInfo.id, ContentItems.sectionInfo.data).then(function (data) {
                                                // Do Something on Success
                                            },
                                            function () {
                                                console.error('Error while updating sections Collection data');
                                            });
                                    }
                                }, function () {

                                });

                            }
                        }
                    }
                };
                if (ContentItems.sectionInfo) {
                    searchOptions = {
                        filter: {'$and': [{"$json.itemTitle": {"$regex": '/*'}}, {"$json.sections": {"$all": [ContentItems.section]}}]},
                        skip: _skip,
                        limit: _limit + 1 // the plus one is to check if there are any more
                    };
                }
                else {
                    searchOptions = {
                        filter: {"$json.itemTitle": {"$regex": '/*'}},
                        skip: _skip,
                        limit: _limit + 1 // the plus one is to check if there are any more
                    };
                }


                var updateSearchOptions = function () {
                    var order;
                    if (ContentItems.info && ContentItems.info.data && ContentItems.info.data.content) {
                        order = OrdersItems.getOrder(ContentItems.info.data.content.sortByItems || OrdersItems.ordersMap.Default);
                    }
                    else
                        order = OrdersItems.getOrder(OrdersItems.ordersMap.Default);

                    if (order) {
                        var sort = {};
                        sort[order.key] = order.order;
                        searchOptions.sort = sort;
                        return true;
                    }
                    else {
                        return false;
                    }
                };

                function updateMasterInfoData(infoData) {
                    ContentItems.masterInfoData = angular.copy(infoData);
                }

                /**
                 * isUnChanged to check whether there is change in controller media item or not
                 * @param obj
                 * @returns {*|boolean}
                 */
                function isUnChanged(obj) {
                    return angular.equals(obj, ContentItems.masterInfoData);
                }

                function saveInfoData(_info) {
                    ContentItems.PlaceInfo.save(_info.data).then(function (data) {
                        updateMasterInfoData(_info);
                    }, function (err) {
                        console.error('Error-------', err);
                    });
                }

                function saveInfoDataWithDelay(_info) {
                    if (tmrDelayForInfo) {
                        clearTimeout(tmrDelayForInfo);
                    }
                    if (!isUnChanged(_info)) {
                        tmrDelayForInfo = setTimeout(function () {
                            saveInfoData(_info);
                        }, 1000);
                    }
                }


                ContentItems.deepLinkUrl = function (url) {
                    buildfire.navigation.scrollTop();
                    Modals.DeeplinkPopupModal(url);
                };

                /**
                 * ContentItems.toggleSortOrder() to change the sort by
                 */
                ContentItems.toggleSortOrder = function (name) {
                    if (name) {
                        var sortOrder = OrdersItems.getOrder(name);
                        ContentItems.items = null;
                        ContentItems.noMore = false;
                        searchOptions.skip = 0;
                        ContentItems.isBusy = false;
                        ContentItems.info.data.content.sortByItems = name;
                        ContentItems.getMore();
                        ContentItems.itemSortableOptions.disabled = !(ContentItems.info.data.content.sortByItems === OrdersItems.ordersMap.Manually);
                    }
                };

                /**
                 * ContentItems.noMore tells if all data has been loaded
                 */
                ContentItems.noMore = false;

                /**
                 * ContentItems.getMore is used to load the items
                 */
                ContentItems.getMore = function () {
                    if (ContentItems.isBusy && !ContentItems.noMore) {
                        return;
                    }
                    updateSearchOptions();
                    ContentItems.isBusy = true;
                    ContentItems.Items.find(searchOptions).then(function success(result) {
                        if (result.length <= _limit) {// to indicate there are more
                            ContentItems.noMore = true;
                        }
                        else {
                            result.pop();
                            searchOptions.skip = searchOptions.skip + _limit;
                            ContentItems.noMore = false;
                        }
                        ContentItems.items = ContentItems.items ? ContentItems.items.concat(result) : result;
                        console.log('items>>>', angular.copy(ContentItems.items));
                        ContentItems.isBusy = false;
                    }, function fail() {
                        ContentItems.isBusy = false;
                    });
                };

                /**
                 * ContentItems.removeListItem() used to delete an item from section list
                 * @param index tells the index of item to be deleted.
                 */
                ContentItems.removeListItem = function (index, event) {

                    if ("undefined" == typeof index) {
                        return;
                    }
                    var item = ContentItems.items[index];
                    if ("undefined" !== typeof item) {
                        //buildfire.navigation.scrollTop();

                        Modals.removePopupModal({title: '', event: event}).then(function (result) {
                            if (result) {
                                ContentItems.Items.delete(item.id).then(function (data) {
                                    ContentItems.items.splice(index, 1);
                                }, function (err) {
                                    console.error('Error while deleting an item-----', err);
                                });
                            }
                            else {
                                console.info('Unable to load data.');
                            }
                        }, function (cancelData) {
                            //do something on cancel
                        });
                    }
                };

                /**
                 * ContentItems.searchListSection() used to search items section
                 * @param value to be search.
                 */
                ContentItems.searchListItem = function (value) {
                    searchOptions.skip = 0;
                    /*reset the skip value*/
                    ContentItems.isBusy = false;
                    ContentItems.items = null;
                    value = value.trim();
                    if (!value) {
                        value = '/*';
                    }
                    searchOptions.filter = {
                        '$and': [{
                            "$json.itemTitle": {
                                "$regex": value,
                                "$options": "i"
                            }
                        }, {"$json.sections": {"$all": [ContentItems.section]}}]
                    };// {"$json.secTitle": {"$regex": value}};
                    ContentItems.getMore();
                };

                ContentItems.editSections = function (ind) {
                    ContentItems.Sections.find({}).then(function (data) {
                        console.log('Sections--------------------------------------popup', data);
                        buildfire.navigation.scrollTop();
                        if (data && data.length > 0)
                            Modals.editSectionModal(data, ContentItems.items[ind]).then(function (result) {
                                ContentItems.Items.update(result.id, result.data).then(function () {
                                    _skip = 0;
                                    ContentItems.items = null;
                                    ContentItems.getMore();
                                }, function () {
                                    console.error('err happened');
                                });


                            }, function (cancelData) {
                                //do something on cancel
                            });
                    }, function (err) {
                    });

                };

                ContentItems.done = function () {
                    Buildfire.history.pop();
                    Location.goToHome();
                };


                if ($rootScope.dontPropagate == true)
                    $rootScope.dontPropagate = false;
                else
                    Messaging.sendMessageToWidget({
                        name: EVENTS.ROUTE_CHANGE,
                        message: {
                            path: PATHS.SECTION,
                            secId: ContentItems.section
                        }
                    });


                $scope.$watch(function () {
                    return ContentItems.info;
                }, saveInfoDataWithDelay, true);

            }]);
})(window.angular, window.tinymce, window.buildfire);