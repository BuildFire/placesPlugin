(function (angular) {
    angular
        .module('placesWidget')
        .controller('WidgetSectionsCtrl', ['$scope', '$window', 'DB', 'COLLECTIONS', '$rootScope', 'Buildfire', 'AppConfig', 'Messaging', 'EVENTS', 'PATHS', 'Location', 'Orders','PlaceInfo',
            function ($scope, $window, DB, COLLECTIONS, $rootScope, Buildfire, AppConfig, Messaging, EVENTS, PATHS, Location, Orders,PlaceInfo) {

                var WidgetSections = this;
                WidgetSections.info = PlaceInfo;

                console.log('Widget Section Ctrl Loaded',WidgetSections.info);

                var _skip = 0,
                    _limit = 5,
                    searchOptions = {
                        //filter: {"$json.secTitle": {"$regex": '/*'}},
                        skip: _skip,
                        limit: _limit + 1 // the plus one is to check if there are any more
                    };
                /**
                 * WidgetSections.isBusy is used for infinite scroll.
                 * @type {boolean}
                 */
                WidgetSections.isBusy = false;
                /**
                 * AppConfig.setSettings() set the Settings.
                 */
                //AppConfig.setSettings(MediaCenterInfo.data);
                /**
                 * AppConfig.changeBackgroundTheme() change the background image.
                 */
                //AppConfig.changeBackgroundTheme(WidgetSections.media.data.design.backgroundImage);
                /**
                 * Messaging.onReceivedMessage is called when any event is fire from Content/design section.
                 * @param event
                 */
                /*Messaging.onReceivedMessage = function (event) {
                    if (event) {
                        switch (event.name) {
                            case EVENTS.ROUTE_CHANGE:
                                var path = event.message.path,
                                    id = event.message.id;
                                var url = "#/";
                                switch (path) {
                                    case PATHS.MEDIA:
                                        url = url + "media/";
                                        if (id) {
                                            url = url + id + "/";
                                        }
                                        break;
                                    default :

                                        break
                                }
                                Location.go(url);
                                break;
                        }
                    }
                };

                /!**
                 * Buildfire.datastore.onUpdate method calls when Data is changed.
                 *!/
                Buildfire.datastore.onUpdate(function (event) {
                    if (event.tag == "MediaCenter") {
                        if (event.data) {
                            WidgetSections.media.data = event.data;
                            console.log(WidgetSections.media);
                            AppConfig.changeBackgroundTheme(WidgetSections.media.data.design.backgroundImage);
                            $scope.$apply();
                        }
                    }
                    else {
                        WidgetSections.items = [];
                        WidgetSections.noMore = false;
                        WidgetSections.loadMore();
                    }
                });*/

                /**
                 * Create instance of Sections db collection
                 * @type {DB}
                 */
                var Sections = new DB(COLLECTIONS.Sections);

                /**
                 * updateGetOptions method checks whether sort options changed or not.
                 * @returns {boolean}
                 */
                var updateGetOptions = function () {
                    var order = Orders.getOrder(WidgetSections.info.data.content.sortBy || Orders.ordersMap.Default);
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
                 * WidgetSections.items holds the array of items.
                 * @type {Array}
                 */
                WidgetSections.sections = [];
                /**
                 * WidgetSections.noMore checks for further data
                 * @type {boolean}
                 */
                WidgetSections.noMore = false;

                /**
                 * loadMore method loads the items in list page.
                 */
                WidgetSections.loadMore = function () {

                    if (WidgetSections.isBusy && !WidgetSections.noMore) {
                        return;
                    }
                    updateGetOptions();
                    WidgetSections.isBusy = true;

                    Sections.find(searchOptions).then(function success(result) {
                        if (WidgetSections.noMore)
                            return;
                        if (result.length <= _limit) {// to indicate there are more
                            WidgetSections.noMore = true;
                        }
                        else {
                            result.pop();
                            searchOptions.skip = searchOptions.skip + _limit;
                            WidgetSections.noMore = false;
                        }
                        WidgetSections.sections = WidgetSections.sections ? WidgetSections.sections.concat(result) : result;
                        WidgetSections.isBusy = false;
                    }, function fail() {
                        WidgetSections.isBusy = false;
                        console.error('error');
                    });
                };
                WidgetSections.loadMore();

                function refreshSections()
                {
                    WidgetSections.sections = [];
                    WidgetSections.noMore = false;
                    WidgetSections.loadMore();
                    $scope.$apply();
                }

                /**
                 * Buildfire.datastore.onUpdate method calls when Data is changed.
                 */
                Buildfire.datastore.onUpdate(function (event) {
                    if (event.tag == "placeInfo") {
                        if (event.data) {
                            WidgetSections.info =event;
                            refreshSections();
                        }
                    }
                    else {
                        refreshSections();
                    }
                });


                $rootScope.$on("Carousel:LOADED", function () {
                    if (WidgetSections.info.data.content && WidgetSections.info.data.content.images) {
                        view = new Buildfire.components.carousel.view("#carousel", []);
                        view.loadItems(WidgetSections.info.data.content.images,false);
                    } else {
                        view.loadItems([]);
                    }
                });

            }]);
})(window.angular, undefined);