(function (angular, window) {
    angular
        .module('placesWidget')
        .controller('WidgetSectionCtrl', ['$scope', '$window', 'AppConfig', 'Messaging', 'Buildfire', 'COLLECTIONS', 'Location', 'EVENTS', 'PATHS', '$timeout', 'DB', '$routeParams', function ($scope, $window, AppConfig, Messaging, Buildfire, COLLECTIONS, Location, EVENTS, PATHS, $timeout, DB, $routeParams) {
            var WidgetSection = this;

            /* Filter variables */
            WidgetSection.showMenu = false;
            WidgetSection.selectedSections = [$routeParams.sectionId];
            WidgetSection.menuTab = 'Category';
            /* Filter variables end */

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

                            if (WidgetSection.placeInfo.data.settings.showDistanceIn == 'miles')
                                $scope.distanceSlider = {
                                    min: 0,
                                    max: 200,
                                    ceil: 200, //upper limit
                                    floor: 0
                                };
                            else
                                $scope.distanceSlider = {
                                    min: 0,
                                    max: 320,
                                    ceil: 320, //upper limit
                                    floor: 0
                                };
                        }
                    }
                    , error = function (err) {
                        console.error('Error while getting data', err);
                    };
                PlaceInfo.get().then(success, error);

                var sectionSuccess = function (result) {
                        if (result) {
                            console.log('section sections',result);
                            WidgetSection.sections = result;
                        }
                    }
                    , sectionError = function (err) {
                        console.error('Error while getting data', err);
                    };
                Sections.find({}).then(sectionSuccess, sectionError);
            };

            var clearOnUpdateListener = Buildfire.datastore.onUpdate(function (event) {
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


            WidgetSection.toggleSectionSelection = function (ind, event) {
                var id = WidgetSection.sections[ind].id;
                if (WidgetSection.selectedSections.indexOf(id) < 0) {
                    WidgetSection.selectedSections.push(id);
                    $(event.target).addClass('active');
                }
                else {
                    WidgetSection.selectedSections.splice(WidgetSection.selectedSections.indexOf(id), 1);
                    $(event.target).removeClass('active');
                }
            };


            function filterChanged() {
                var itemFilter;
                console.log('filter changed', WidgetSection.selectedSections);
                if (WidgetSection.selectedSections.length) {
                    itemFilter = {
                        'filter': {'$json.sections': {'$in': WidgetSections.selectedSections}}
                    };
                }
                else {
                    itemFilter = {filter: {"$json.itemTitle": {"$regex": '/*'}}};
                }
                Items.find(itemFilter).then(function (res) {

                    res.forEach(function (_item) {
                        _item.data.distance = 0; // default distance value
                        _item.data.distanceText = 'Fetching..';
                    });

                    WidgetSection.items = res;
                }, function () {

                });


            }

            WidgetSection.resetSectionFilter = function () {
                if (WidgetSection.selectedSections.length == 0) {

                    return;
                }
                //WidgetSection.showSections = false;
                WidgetSection.selectedSections = [];
                filterChanged();
                $('.active.section-filter').removeClass('active');
            };

            WidgetSection.sortFilter = function (item) {

                if (WidgetSection.locationData.currentCoordinates == null || item.data.distanceText == 'Fetching..') {
                    return true;
                }
                //console.log(Number(item.data.distanceText.split(' ')[0]),$scope.distanceSlider);
                return (Number(item.data.distanceText.split(' ')[0]) >= $scope.distanceSlider.min && Number(item.data.distanceText.split(' ')[0]) <= $scope.distanceSlider.max);
            };

            /**
             * will called when controller scope has been destroyed.
             */
            $scope.$on("$destroy", function () {
                clearOnUpdateListener.clear();
            });
        }]);
})(window.angular, window);