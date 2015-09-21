(function (angular) {
    'use strict';
    angular
        .module('placesContent')
        .controller('ContentSectionsCtrl', ['$scope', 'PlaceInfo', 'DB', '$timeout', 'COLLECTIONS', 'Orders', 'AppConfig', 'Messaging', 'EVENTS', 'PATHS', '$csv', 'Buildfire','Modals',
            function ($scope, PlaceInfo, DB, $timeout, COLLECTIONS, Orders, AppConfig, Messaging, EVENTS, PATHS, $csv, Buildfire,Modals) {
                var ContentSections = this;
                ContentSections.isBusy = false;
                /* tells if data is being fetched*/
                ContentSections.sections = [];

                ContentSections.sortOptions = Orders.options;

                Buildfire.deeplink.createLink('section:7');
                Buildfire.deeplink.getData(function (data) {
                    console.log('DeepLInk calleed', data);
                    if (data) alert('deep link data: ' + data);
                });
                ContentSections.info = PlaceInfo;
                AppConfig.setSettings(PlaceInfo.data);
                AppConfig.setAppId(PlaceInfo.id);
                updateMasterInfo(ContentSections.info);

                var header = {
                    mainImage: 'Section Image',
                    secTitle: 'Section Title',
                    secSummary: "Section Summary",
                    itemListBGImage: 'Item List Background Image'
                };
                var headerRow = ["mainImage", "secTitle", "secSummary", "itemListBGImage"];
                var tmrDelayForMedia = null;
                var _skip = 0,
                    _limit = 5,
                    _maxLimit = 19,
                    searchOptions = {
                        filter: {"$json.secTitle": {"$regex": '/*'}},
                        skip: _skip,
                        limit: _limit + 1 // the plus one is to check if there are any more
                    };

                /**
                 * Create instance of PlaceInfo,Sections and Items db collection
                 * @type {DB}
                 */
                var PlaceInfo = new DB(COLLECTIONS.PlaceInfo),
                    Sections = new DB(COLLECTIONS.Sections);
                    //,Items = new DB(COLLECTIONS.Items);

                var updateSearchOptions = function () {
                    var order;
                    if (ContentSections.info && ContentSections.info.data && ContentSections.info.data.content)
                        order = Orders.getOrder(ContentSections.info.data.content.sortBy || Orders.ordersMap.Default);
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

                /**
                 * ContentSections.getTemplate() used to download csv template
                 */
                ContentSections.getTemplate = function () {
                    var templateData = [{
                        mainImage: '',
                        secTitle: '',
                        secSummary: '',
                        itemListBGImage: ''
                    }];
                    var csv = $csv.jsonToCsv(angular.toJson(templateData), {
                        header: header
                    });
                    $csv.download(csv, "Template.csv");
                };

                /**
                 * records holds the data to export the data.
                 * @type {Array}
                 */
                var records = [];

                /**
                 * getRecords function get the  all items from DB
                 * @param searchOption
                 * @param records
                 * @param callback
                 */
                function getRecords(searchOption, records, callback) {
                    Sections.find(searchOption).then(function (result) {
                        if (result.length <= _maxLimit) {// to indicate there are more
                            records = records.concat(result);
                            return callback(records);
                        }
                        else {
                            result.pop();
                            searchOption.skip = searchOption.skip + _maxLimit;
                            records = records.concat(result);
                            return getRecords(searchOption, records, callback);
                        }
                    }, function (error) {
                        throw (error);
                    });
                }

                /**
                 * ContentSections.exportCSV() used to export people list data to CSV
                 */
                ContentSections.exportCSV = function () {
                    var search = angular.copy(searchOptions);
                    search.skip = 0;
                    search.limit = _maxLimit + 1;
                    getRecords(search,
                        []
                        , function (data) {
                            if (data && data.length) {
                                var persons = [];
                                angular.forEach(angular.copy(data), function (value) {
                                    delete value.data.dateCreated;
                                    persons.push(value.data);
                                });
                                var csv = $csv.jsonToCsv(angular.toJson(persons), {
                                    header: header
                                });
                                $csv.download(csv, "Export.csv");
                            }
                            else {
                                ContentSections.getTemplate();
                            }
                            records = [];
                        });
                };

                function isValidItem(item, index, array) {
                    return item.secTitle || item.secSummary;
                }

                function validateCsv(items) {
                    if (!Array.isArray(items) || !items.length) {
                        return false;
                    }
                    return items.every(isValidItem);
                }

                /**
                 * method to open the importCSV Dialog
                 */
                ContentSections.openImportCSVDialog = function () {
                    $csv.import(headerRow).then(function (rows) {
                        //ContentSections.loading = true;
                        if (rows && rows.length) {
                            console.log(ContentSections.info);
                            var rank = ContentSections.info.data.content.rankOfLastItem || 0;
                            for (var index = 0; index < rows.length; index++) {
                                rank += 10;
                                rows[index].dateCreated = +new Date();
                            }
                            if (validateCsv(rows)) {
                                Sections.insert(rows).then(function (data) {
                                    //ContentSections.loading = false;
                                    ContentSections.isBusy = false;
                                    ContentSections.sections = [];
                                    ContentSections.info.data.content.rankOfLastItem = rank;
                                    ContentSections.getMore();
                                }, function errorHandler(error) {
                                    console.error(error);
                                    //ContentHome.loading = false;
                                    $scope.$apply();
                                });
                            } else {
                                //ContentHome.loading = false;
                                ContentSections.csvDataInvalid = true;
                                $timeout(function hideCsvDataError() {
                                    ContentSections.csvDataInvalid = false;
                                }, 2000);
                            }
                        }
                        else {
                            //ContentHome.loading = false;
                            $scope.$apply();
                        }
                    }, function (error) {
                        //ContentHome.loading = false;
                        $scope.apply();
                        //do something on cancel
                    });
                };

                /**
                 * ContentSections.removeListSection() used to delete an item from section list
                 * @param _index tells the index of item to be deleted.
                 */
                ContentSections.removeListSection = function (index) {

                    if ("undefined" == typeof index) {
                        return;
                    }
                    var item = ContentSections.sections[index];
                    if ("undefined" !== typeof item) {
                        Modals.removePopupModal({title: ''}).then(function (result) {
                            if (result) {
                                Sections.delete(item.id).then(function (data) {
                                    ContentSections.sections.splice(index, 1);
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
                 * ContentSections.noMore tells if all data has been loaded
                 */
                ContentSections.noMore = false;

                /**
                 * ContentSections.getMore is used to load the items
                 */
                ContentSections.getMore = function () {
                    if (ContentSections.isBusy && !ContentSections.noMore) {
                        return;
                    }
                    updateSearchOptions();
                    ContentSections.isBusy = true;
                    Sections.find(searchOptions).then(function success(result) {
                        if (result.length <= _limit) {// to indicate there are more
                            ContentSections.noMore = true;
                        }
                        else {
                            result.pop();
                            searchOptions.skip = searchOptions.skip + _limit;
                            ContentSections.noMore = false;
                        }
                        ContentSections.sections = ContentSections.sections ? ContentSections.sections.concat(result) : result;
                        ContentSections.isBusy = false;
                    }, function fail() {
                        ContentSections.isBusy = false;
                    });
                };

                /**
                 * ContentSections.searchListSection() used to search items section
                 * @param value to be search.
                 */
                ContentSections.searchListSection = function (value) {
                    searchOptions.skip = 0; /*reset the skip value*/

                    ContentSections.isBusy = false;
                    ContentSections.sections = [];
                    value = value.trim();
                    if (!value) {
                        value = '/*';
                    }
                    searchOptions.filter = {"$json.secTitle": {"$regex": value}};
                    ContentSections.getMore();
                };

                /**
                 * ContentHome.toggleSortOrder() to change the sort by
                 */
                ContentSections.toggleSortOrder = function (name) {
                    if (!name) {
                        console.info('There was a problem sorting your data');
                    } else {
                        ContentSections.items = [];

                        /* reset Search options */
                        ContentSections.noMore = false;
                        searchOptions.skip = 0;
                        /* Reset skip to ensure search begins from scratch*/

                        ContentSections.isBusy = false;
                        var sortOrder = Orders.getOrder(name || Orders.ordersMap.Default);
                        ContentSections.info.data.content.sortBy = name;
                        ContentSections.info.data.content.sortByValue = sortOrder.value;
                        ContentSections.sections = [];
                        ContentSections.getMore();
                        ContentSections.itemSortableOptions.disabled = !(ContentSections.info.data.content.sortBy === Orders.ordersMap.Manually);
                    }
                };


                ContentSections.itemSortableOptions = {
                    handle: '> .cursor-grab',
                    disabled: !(ContentSections.info.data.content.sortBy === Orders.ordersMap.Manually),
                    stop: function (e, ui) {
                        var endIndex = ui.item.sortable.dropindex,
                            maxRank = 0,
                            draggedItem = ContentSections.items[endIndex];
                        console.log(ui.item.sortable.dropindex)
                        if (draggedItem) {
                            var prev = ContentSections.items[endIndex - 1],
                                next = ContentSections.items[endIndex + 1];
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
                                Sections.update(draggedItem.id, draggedItem.data, function (err) {
                                    if (err) {
                                        console.error('Error during updating rank');
                                    } else {
                                        if (ContentSections.data.content.rankOfLastItem < maxRank) {
                                            ContentSections.data.content.rankOfLastItem = maxRank;
                                        }
                                    }
                                });
                            }
                        }
                    }
                };


                function isUnchanged(info) {
                    return angular.equals(info, ContentSections.masterInfo);
                }

                function updateData() {
                    PlaceInfo.update(ContentSections.info.id, ContentSections.info.data).then(function (data) {
                        updateMasterInfo(data);
                        AppConfig.setSettings(ContentSections.info.data);
                    }, function (err) {
                        //resetInfo();
                        console.error('Error-------', err);
                    });
                }

                function saveDataWithDelay() {
                    if (tmrDelayForMedia) {
                        clearTimeout(tmrDelayForMedia);
                    }
                    if (!isUnchanged(ContentSections.info)) {
                        tmrDelayForMedia = setTimeout(function () {
                            updateData();
                        }, 1000);
                    }
                }

                function updateMasterInfo(info) {
                    ContentSections.masterInfo = angular.copy(info);
                }

                $scope.$watch(function () {
                    return ContentSections.info;
                }, saveDataWithDelay, true);

                /*
                 * Fetch data from datastore
                 */
               /* var init = function () {
                    var success = function (result) {
                            ContentSections.sections = result;
                            console.log('>>>>>>>>>>>>>',result);
                        }
                        , error = function (err) {
                            console.error('Error while getting data', err);
                        };
                    Sections.find(searchOptions).then(success, error);
                };

                init();*/
            }]);
})(window.angular, undefined);
