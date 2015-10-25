(function (angular) {
    'use strict';
    angular
        .module('placesContent')
        .controller('ContentSectionsCtrl', ['$scope', 'DB', '$timeout', 'COLLECTIONS', 'Orders', 'OrdersItems', 'AppConfig', 'Messaging', 'EVENTS', 'PATHS', '$csv', 'Buildfire', 'Modals', 'placesInfo',
            function ($scope, DB, $timeout, COLLECTIONS, Orders, OrdersItems, AppConfig, Messaging, EVENTS, PATHS, $csv, Buildfire, Modals, placesInfo) {

                var header = {
                        secTitle: 'Section Title',
                        mainImage: 'Section Image',
                        secSummary: "Section Summary",
                        itemListBGImage: 'Item List Background Image',
                        itemTitle: 'Item Title',
                        summary: 'Item Summary',
                        listImage: 'List Image',
                        images: 'Carousel images',
                        bodyContent: 'Body Content',
                        addressTitle: 'Address Title',
                        address: 'Address',
                        webURL: 'Web URL',
                        sendToEmail: 'Send to Email',
                        smsTextNumber: 'SMS Text Number',
                        phoneNumber: 'Phone Number',
                        facebookURL: 'Facebook URL',
                        twitterURL: 'Twitter URL',
                        instagramURL: 'Instagram URL',
                        googlePlusURL: 'Google+ URL',
                        linkedinURL: 'Linkedin URL',
                        mapAddress: 'Map Address'
                    }
                    , headerRow = ["secTitle", "mainImage", "secSummary", "itemListBGImage", "itemTitle", "summary", "listImage", "images", "bodyContent", "addressTitle", "address", "webURL", "sendToEmail", "smsTextNumber", "phoneNumber", "facebookURL", "twitterURL", "instagramURL", "googlePlusURL", "linkedinURL", "mapAddress"]
                    , tmrDelayForMedia = null
                    , _skip = 0
                    , _limit = 5
                    , _maxLimit = 19
                    , searchOptions = {
                        filter: {"$json.secTitle": {"$regex": '/*'}},
                        skip: _skip,
                        limit: _limit + 1 // the plus one is to check if there are any more
                    }
                    , PlaceInfo = new DB(COLLECTIONS.PlaceInfo)
                    , Sections = new DB(COLLECTIONS.Sections)
                    , Items = new DB(COLLECTIONS.Items)
                    , records = []
                    , _infoData = {
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

                var ContentSections = this;
                ContentSections.showAllItems = true;
                ContentSections.masterInfo = null;

                if (placesInfo) {
                    updateMasterInfo(placesInfo);
                    ContentSections.info = placesInfo;
                }
                else {
                    updateMasterInfo(_infoData);
                    ContentSections.info = _infoData;
                }


                ContentSections.isBusy = false;
                ContentSections.sections = [];
                ContentSections.sortOptions = Orders.options;

                ContentSections.deepLinkUrl = function (url) {
                    Modals.DeeplinkPopupModal(url);
                };

                ContentSections.itemSortableOptions = {
                    handle: '> .cursor-grab',
                    disabled: !(ContentSections.info.data.content.sortBy === Orders.ordersMap.Manually),
                    stop: function (e, ui) {
                        var endIndex = ui.item.sortable.dropindex,
                            maxRank = 0,
                            draggedItem = ContentSections.sections[endIndex];
                        if (draggedItem) {
                            var prev = ContentSections.sections[endIndex - 1],
                                next = ContentSections.sections[endIndex + 1];
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

                                Sections.update(draggedItem.id, draggedItem.data).then(function () {
                                    ContentSections.info.data.content.rankOfLastItem = maxRank;
                                }, function () {
                                });
                            }
                        }
                    }
                };
                //option for wysiwyg
                ContentSections.bodyWYSIWYGOptions = {
                    plugins: 'advlist autolink link image lists charmap print preview',
                    skin: 'lightgray',
                    trusted: true,
                    theme: 'modern'
                };
                /**
                 * ContentSections.noMore tells if all data has been loaded
                 */
                ContentSections.noMore = false;
                // create a new instance of the buildfire carousel editor
                ContentSections.editor = new Buildfire.components.carousel.editor("#carousel");

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

                function saveData(_info) {
                    PlaceInfo.save(_info.data).then(function (data) {
                        updateMasterInfo(_info);
                        AppConfig.setSettings(_info.data);
                        if (_info.id)
                            AppConfig.setAppId(_info.id);
                    }, function (err) {
                        console.error('Error-------', err);
                    });
                }

                function saveDataWithDelay(_info) {
                    if (tmrDelayForMedia) {
                        clearTimeout(tmrDelayForMedia);
                    }
                    if (!isUnchanged(_info)) {
                        tmrDelayForMedia = setTimeout(function () {
                            saveData(_info);
                        }, 1000);
                    }
                }

                function isUnchanged(info) {
                    return angular.equals(info, ContentSections.masterInfo);
                }

                function updateMasterInfo(info) {
                    ContentSections.masterInfo = angular.copy(info);
                }

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

                /* Buildfire.deeplink.createLink('section:7');
                 Buildfire.deeplink.getData(function (data) {
                 if (data) alert('deep link data: ' + data);
                 });*/


                // this method will be called when a new item added to the list
                ContentSections.editor.onAddItems = function (items) {
                    if (!ContentSections.info.data.content.images)
                        ContentSections.info.data.content.images = [];
                    ContentSections.info.data.content.images.push.apply(ContentSections.info.data.content.images, items);
                    $scope.$digest();
                };
                // this method will be called when an item deleted from the list
                ContentSections.editor.onDeleteItem = function (item, index) {
                    ContentSections.info.data.content.images.splice(index, 1);
                    $scope.$digest();
                };
                // this method will be called when you edit item details
                ContentSections.editor.onItemChange = function (item, index) {
                    ContentSections.info.data.content.images.splice(index, 1, item);
                    $scope.$digest();
                };
                // this method will be called when you change the order of items
                ContentSections.editor.onOrderChange = function (item, oldIndex, newIndex) {
                    var temp = ContentSections.info.data.content.images[oldIndex];
                    ContentSections.info.data.content.images[oldIndex] = ContentSections.info.data.content.images[newIndex];
                    ContentSections.info.data.content.images[newIndex] = temp;
                    $scope.$digest();
                };

                // initialize carousel data
                if (!ContentSections.info.data.content.images)
                    ContentSections.editor.loadItems([]);
                else
                    ContentSections.editor.loadItems(ContentSections.info.data.content.images);


                /**
                 * ContentSections.getTemplate() used to download csv template
                 */
                ContentSections.getTemplate = function () {
                    var templateData = [{
                        secTitle: '',
                        mainImage: '',
                        secSummary: '',
                        itemListBGImage: '',
                        itemTitle: '',
                        summary: '',
                        listImage: '',
                        images: '',
                        bodyContent: '',
                        addressTitle: '',
                        address: '',
                        webURL: '',
                        sendToEmail: '',
                        smsTextNumber: '',
                        phoneNumber: '',
                        facebookURL: '',
                        twitterURL: '',
                        instagramURL: '',
                        googlePlusURL: '',
                        linkedinURL: '',
                        mapAddress: ''
                    }];
                    var csv = $csv.jsonToCsv(angular.toJson(templateData), {
                        header: header
                    });
                    $csv.download(csv, "Template.csv");
                };
                /**
                 * method to open the importCSV Dialog
                 */
                ContentSections.openImportCSVDialog = function () {
                    $csv.import(headerRow).then(function (rows) {
                        console.log('Rows in Import CSV---------------------', rows);
                        //ContentSections.loading = true;
                        var secArray = [],
                            itemArray = [],
                            itemSecMap = [];
                        if (rows && rows.length) {
                            var rankSec = ContentSections.info.data.content.rankOfLastItem || 0;
                            var rankItem = ContentSections.info.data.content.rankOfLastItem || 0;
                            angular.forEach(rows, function (row) {
                                rankSec += 10;
                                rankItem += 10;
                                if (validateCsv(rows)) {
                                    Sections.insert({
                                        secTitle: row.secTitle,
                                        mainImage: row.mainImage,
                                        secSummary: row.secSummary,
                                        itemListBGImage: row.itemListBGImage,
                                        dateCreated: +new Date(),
                                        rank: rankSec
                                    }).then(function (data) {
                                        console.log('Sections inserted=--------------------', data);
                                        //ContentSections.loading = false;
                                        ContentSections.isBusy = false;
                                        ContentSections.sections = [];
                                        ContentSections.info.data.content.rankOfLastItem = rankSec;
                                        ContentSections.getMore();
                                        if (data && data.id) {
                                            Items.insert({
                                                itemTitle: row.itemTitle,
                                                summary: row.summary,
                                                listImage: row.listImage,
                                                images: row.images,
                                                bodyContent: row.bodyContent,
                                                addressTitle: row.addressTitle,
                                                address: row.address,
                                                dateCreated: +new Date(),
                                                rank: rankSec,
                                                sections:[data.id]
                                            }).then(function (data) {
                                                console.log('Item inserted using Import CSV-----', data);
                                            }, function (error) {
                                                console.log('Error----------', error);
                                            });
                                        }
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
                            });
                            /*for (var index = 0; index < rows.length; index++) {
                             rankSec += 10;
                             itemSecMap.push({sec: rows[index].secTitle, item: rows[index].itemTitle});
                             secArray.push({
                             secTitle: rows[index].secTitle,
                             mainImage: rows[index].mainImage,
                             secSummary: rows[index].secSummary,
                             itemListBGImage: rows[index].itemListBGImage,
                             dateCreated: +new Date(),
                             rank: rankSec
                             });
                             itemArray.push({
                             itemTitle: rows[index].itemTitle,
                             summary: rows[index].summary,
                             listImage: rows[index].listImage,
                             images: rows[index].images,
                             bodyContent: rows[index].bodyContent,
                             addressTitle: rows[index].addressTitle,
                             address: rows[index].address,
                             webURL: rows[index].webURL,
                             sendToEmail: rows[index].sendToEmail,
                             smsTextNumber: rows[index].smsTextNumber,
                             phoneNumber: rows[index].phoneNumber,
                             facebookURL: rows[index].facebookURL,
                             twitterURL: rows[index].twitterURL,
                             instagramURL: rows[index].instagramURL,
                             googlePlusURL: rows[index].googlePlusURL,
                             linkedinURL: rows[index].linkedinURL,
                             mapAddress: rows[index].mapAddress,
                             dateCreated: +new Date(),
                             rank: rankSec,
                             sections:[]
                             });
                             }*/
                            /* if (validateCsv(rows)) {
                             Sections.insert(secArray).then(function (data) {
                             console.log('Sections inserted=--------------------', data);
                             //ContentSections.loading = false;
                             ContentSections.isBusy = false;
                             ContentSections.sections = [];
                             ContentSections.info.data.content.rankOfLastItem = rankSec;
                             ContentSections.getMore();
                             if (data) {
                             Items.insert(itemArray).then(function (data) {
                             console.log('Item inserted using Import CSV-----', data);
                             }, function (error) {
                             console.log('Error----------', error);
                             });
                             }
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
                             }*/
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
                /**
                 * ContentSections.removeListSection() used to delete an item from section list
                 * @param _index tells the index of item to be deleted.
                 */
                ContentSections.removeListSection = function (_index) {

                    if ("undefined" == typeof _index) {
                        return;
                    }
                    var item = ContentSections.sections[_index];

                    if ("undefined" !== typeof item) {
                        Modals.removePopupModal({title: ''}).then(function (result) {
                            if (result) {
                                Sections.delete(item.id).then(function (data) {
                                    ContentSections.sections.splice(_index, 1);

                                    var itemOptions = {
                                        filter: {'$and': [{"$json.itemTitle": {"$regex": '/*'}}, {"$json.sections": {"$all": [item.id]}}]}
                                    };
                                    Items.find(itemOptions).then(function (items) {
                                        console.log(items);
                                        items.forEach(function (_item) {
                                            if (_item.data.sections.length == 1) {
                                                Items.delete(_item.id, function () {
                                                }, function () {
                                                });
                                            }
                                            else {
                                                _item.data.sections.splice(_item.data.sections.indexOf(item.id), 1);
                                                Items.update(_item.id, _item.data, function () {
                                                }, function () {
                                                });
                                            }
                                        });
                                    }, function () {
                                    });

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
                 * ContentSections.getMore is used to load the items
                 */
                ContentSections.getMore = function () {
                    //if (ContentSections.isBusy && !ContentSections.noMore) {
                    if (ContentSections.isBusy || ContentSections.noMore) {
                        return;
                    }
                    updateSearchOptions();
                    console.log('searching for ', searchOptions);
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
                    searchOptions.skip = 0;
                    /*reset the skip value*/
                    ContentSections.noMore = false;
                    ContentSections.isBusy = false;
                    ContentSections.sections = [];
                    value = value.trim();
                    if (!value) {
                        value = '/*';
                    }
                    searchOptions.filter = {"$json.secTitle": {"$regex": value, "$options": "i"}};
                    ContentSections.getMore();
                };
                /**
                 * ContentHome.toggleSortOrder() to change the sort by
                 */
                ContentSections.toggleSortOrder = function (name) {
                    if (!name) {
                        console.info('There was a problem sorting your data');
                    } else {
                        var sortOrder = Orders.getOrder(name || Orders.ordersMap.Default);
                        ContentSections.noMore = false;
                        searchOptions.skip = 0;
                        ContentSections.isBusy = false;
                        ContentSections.info.data.content.sortBy = name;
                        ContentSections.sections = [];
                        ContentSections.getMore();
                        ContentSections.itemSortableOptions.disabled = !(ContentSections.info.data.content.sortBy === Orders.ordersMap.Manually);
                    }
                };

                ContentSections.selectAllItemImage = function () {
                    Modals.selectAllItemImageModal(ContentSections.info).then(function (data) {
                        console.log('Select Image Popup----Success----------', data);
                        ContentSections.info = data;
                    }, function (err) {
                        console.log('Select Image PopUp --Error-----------', err);
                    });
                };

                //syn with widget
                Messaging.sendMessageToWidget({
                    name: EVENTS.ROUTE_CHANGE,
                    message: {
                        path: PATHS.HOME
                    }
                });
                $scope.$watch(function () {
                    return ContentSections.info;
                }, saveDataWithDelay, true);

            }]);
})(window.angular, undefined);