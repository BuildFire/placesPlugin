(function (angular, window) {
    angular
        .module('placesWidget')
        .controller('WidgetSectionCtrl', ['$scope', '$window', 'AppConfig', 'Messaging', 'Buildfire', 'COLLECTIONS', 'Location', 'EVENTS', 'PATHS', '$timeout', 'DB', '$routeParams', function ($scope, $window, AppConfig, Messaging, Buildfire, COLLECTIONS, Location, EVENTS, PATHS, $timeout, DB, $routeParams) {
            AppConfig.changeBackgroundTheme();
            var WidgetSection = this;
            WidgetSection.placeInfo = null;
            console.log('Section Controller called');
            var Sections = new DB(COLLECTIONS.Sections),
                Items = new DB(COLLECTIONS.Items),
                PlaceInfo = new DB(COLLECTIONS.PlaceInfo);

            WidgetSection.section = $routeParams.sectionId;
            WidgetSection.isBusy = false;
            /* tells if data is being fetched*/
            WidgetSection.items = [];
            var _skip = 0,
                _limit = 5,
                _maxLimit = 19,
                searchOptions = {
                    filter: {'$and': [{"$json.itemTitle": {"$regex": '/*'}}, {"$json.sections": {"$all": [WidgetSection.section]}}]},
                    skip: _skip,
                    limit: _limit + 1 // the plus one is to check if there are any more
                };
            /**
             * ContentItems.noMore tells if all data has been loaded
             */
            WidgetSection.noMore = false;

            /**
             * ContentItems.getMore is used to load the items
             */
            WidgetSection.getMore = function () {
                if (WidgetSection.isBusy && WidgetSection.noMore) {
                    return;
                }
                //updateSearchOptions();
                WidgetSection.isBusy = true;
                Items.find(searchOptions).then(function success(result) {
                    if (result.length <= _limit) {// to indicate there are more
                        WidgetSection.noMore = true;
                    }
                    else {
                        WidgetSection.isBusy = false;
                        result.pop();
                        searchOptions.skip = searchOptions.skip + _limit;
                        WidgetSection.noMore = false;
                    }
                    WidgetSection.items = WidgetSection.items ? WidgetSection.items.concat(result) : result;
                }, function fail() {
                    WidgetSection.isBusy = false;
                });
            };


            /**
             * init() private function
             * It is used to fetch previously saved user's data
             */
            var init = function () {
                var success = function (result) {
                        if (result && result.data && result.id) {
                            WidgetSection.placeInfo = result;
                        }
                    }
                    , error = function (err) {
                        console.error('Error while getting data', err);
                    },
                    secSuccess = function (result) {
                        if (result && result.data && result.id) {
                            WidgetSection.secInfo = result;
                            if (result.data.itemListBGImage)
                                AppConfig.changeBackgroundTheme(result.data.itemListBGImage);
                        }
                    }
                    , secError = function (err) {
                        console.error('Error while getting data', err);
                    };
                PlaceInfo.get().then(success, error);
                if ($routeParams.sectionId)
                    Sections.getById($routeParams.sectionId).then(secSuccess, secError);
            };

            var clearOnUpdateListener = Buildfire.datastore.onUpdate(function (event) {
                if (event.tag === "sections") {
                    if (event.data) {
                        AppConfig.changeBackgroundTheme(event.data.itemListBGImage);
                    }
                }
                console.log('ONUpdate------in section controller----', event);
            });

            //syn with widget side
            Messaging.sendMessageToControl({
                name: EVENTS.ROUTE_CHANGE,
                message: {
                    path: PATHS.SECTION,
                    id: $routeParams.sectionId
                }
            });

            /**
             * init() function invocation to fetch previously saved user's data from datastore.
             */
            init();

            /**
             * will called when controller scope has been destroyed.
             */
            $scope.$on("$destroy", function () {
                clearOnUpdateListener.clear();
            });
        }]);
})(window.angular, window);