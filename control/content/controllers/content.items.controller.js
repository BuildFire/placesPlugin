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
        .controller('ContentItemsCtrl', ['$scope', '$routeParams', 'DB', 'COLLECTIONS', 'Modals', 'Orders', 'OrdersItems', 'Messaging', 'EVENTS', 'PATHS', 'Location', 'placesInfo', 'sectionInfo',
            function ($scope, $routeParams, DB, COLLECTIONS, Modals, Orders, OrdersItems, Messaging, EVENTS, PATHS, Location, placesInfo, sectionInfo) {

                /**
                 * Create instance of Sections and Items db collection
                 * @type {DB}
                 */
                var Sections = new DB(COLLECTIONS.Sections)
                    , Items = new DB(COLLECTIONS.Items)
                    , PlaceInfo = new DB(COLLECTIONS.PlaceInfo)
                    , tmrDelayForInfo = null
                    , _skip = 0
                    , _limit = 5
                    , _maxLimit = 19
                    , placeInfoData = {
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

                var ContentItems = this;
                ContentItems.sectionInfo = sectionInfo;
                if (placesInfo) {
                    updateMasterInfoData(placesInfo);
                    ContentItems.info = placesInfo;
                } else {
                    updateMasterInfoData(placeInfoData);
                    ContentItems.info = angular.copy(placeInfoData);
                }
                ContentItems.section = $routeParams.sectionId;
                ContentItems.isBusy = false;
                ContentItems.items = null;
                ContentItems.masterInfoData = null;
                ContentItems.sortOptions = OrdersItems.options;
                ContentItems.itemSortableOptions = {
                    handle: '> .cursor-grab',
                    disabled: !(ContentItems.info.data.content.sortBy === Orders.ordersMap.Manually),
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
                                Items.update(draggedItem.id, draggedItem.data).then(function (updataeditem) {
                                    console.log('Updated item--------------------------------', updataeditem);
                                    ContentItems.sectionInfo.data.rankOfLastItem = maxRank;
                                    // Update the rankOfLastItem in a particular section
                                    Sections.update(ContentItems.sectionInfo.id, ContentItems.sectionInfo.data).then(function (data) {
                                            // Do Something on Success
                                        },
                                        function () {
                                            console.error('Error while updating sections Collection data');
                                        });
                                }, function () {

                                });
                            }
                        }
                    }
                };
                var searchOptions = {
                    filter: {'$and': [{"$json.itemTitle": {"$regex": '/*'}}, {"$json.sections": {"$all": [ContentItems.section]}}]},
                    skip: _skip,
                    limit: _limit + 1 // the plus one is to check if there are any more
                };


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
                    PlaceInfo.save(_info.data).then(function (data) {
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
                    Items.find(searchOptions).then(function success(result) {
                        if (result.length <= _limit) {// to indicate there are more
                            ContentItems.noMore = true;
                        }
                        else {
                            result.pop();
                            searchOptions.skip = searchOptions.skip + _limit;
                            ContentItems.noMore = false;
                        }
                        ContentItems.items = ContentItems.items ? ContentItems.items.concat(result) : result;
                        ContentItems.isBusy = false;
                    }, function fail() {
                        ContentItems.isBusy = false;
                    });
                };

                /**
                 * ContentItems.removeListItem() used to delete an item from section list
                 * @param index tells the index of item to be deleted.
                 */
                ContentItems.removeListItem = function (index) {

                    if ("undefined" == typeof index) {
                        return;
                    }
                    var item = ContentItems.items[index];
                    if ("undefined" !== typeof item) {
                        Modals.removePopupModal({title: ''}).then(function (result) {
                            if (result) {
                                Items.delete(item.id).then(function (data) {
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
                    searchOptions.filter = {'$and': [{"$json.itemTitle": {"$regex": value, "$options": "i"}}, {"$json.sections": {"$all": [ContentItems.section]}}]};// {"$json.secTitle": {"$regex": value}};
                    ContentItems.getMore();
                };

                ContentItems.editSections = function (ind) {
                    Sections.find({}).then(function (data) {
                        Modals.editSectionModal(data, ContentItems.items[ind]).then(function (result) {
                            //console.log(result);

                            Items.update(result.id, result.data).then(function () {
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
                    Location.goToHome();
                };

                //syn with widget
                Messaging.sendMessageToWidget({
                    name: EVENTS.ROUTE_CHANGE,
                    message: {
                        path: PATHS.SECTION,
                        secId: $routeParams.sectionId
                    }
                });

                $scope.$watch(function () {
                    return ContentItems.info;
                }, saveInfoDataWithDelay, true);

            }]);
})(window.angular, window.tinymce);