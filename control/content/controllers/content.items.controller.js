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
        .controller('ContentItemsCtrl', ['$scope','$routeParams','DB','COLLECTIONS','Modals','OrdersItems',
            function ($scope,$routeParams,DB,COLLECTIONS,Modals,OrdersItems) {

                var ContentItems = this;

                /**
                 * Create instance of PlaceInfo,Sections and Items db collection
                 * @type {DB}
                 */
                var PlaceInfo = new DB(COLLECTIONS.PlaceInfo),
                    Sections = new DB(COLLECTIONS.Sections),
                    Items = new DB(COLLECTIONS.Items);

                ContentItems.section  = $routeParams.sectionId;
                console.log(ContentItems.section);
                ContentItems.isBusy = false;
                /* tells if data is being fetched*/
                ContentItems.items = [];

                ContentItems.sortOptions = OrdersItems.options;

                var _skip = 0,
                    _limit = 5,
                    _maxLimit = 19,
                    searchOptions = {
                        filter: {'$and':[{"$json.itemTitle": {"$regex": '/*'}},{"$json.sections": { "$all": [ContentItems.section]}}]},
                        skip: _skip,
                        limit: _limit + 1 // the plus one is to check if there are any more
                    };

                /**
                 * ContentItems.toggleSortOrder() to change the sort by
                 */
                ContentItems.toggleSortOrder = function (name) {
                    if (!name) {
                        console.info('There was a problem sorting your data');
                    } else {
                        ContentItems.items = [];

                        /* reset Search options */
                        ContentItems.noMore = false;
                        searchOptions.skip = 0;
                        /* Reset skip to ensure search begins from scratch*/

                        ContentItems.isBusy = false;
                        var sortOrder = OrdersItems.getOrder(name || OrdersItems.ordersMap.Default);
                        ContentItems.info.data.content.sortBy = name;
                        ContentItems.info.data.content.sortByValue = sortOrder.value;
                        ContentItems.getMore();
                        ContentItems.itemSortableOptions.disabled = !(ContentItems.info.data.content.sortBy === Orders.ordersMap.Manually);
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
                    //updateSearchOptions();
                    ContentItems.isBusy = true;
                    Items.find(searchOptions).then(function success(result) {
                        console.log('???????????',result);
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
                ContentItems.getMore();


                /**
                 * ContentItems.removeListItem() used to delete an item from section list
                 * @param _index tells the index of item to be deleted.
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
                    searchOptions.skip = 0; /*reset the skip value*/

                    ContentItems.isBusy = false;
                    ContentItems.items = [];
                    value = value.trim();
                    if (!value) {
                        value = '/*';
                    }
                    searchOptions.filter = {'$and':[{"$json.itemTitle": {"$regex": value}},{"$json.sections": { "$all": [ContentItems.section]}}]};// {"$json.secTitle": {"$regex": value}};
                    ContentItems.getMore();
                };

            }]);
})(window.angular, window.tinymce);