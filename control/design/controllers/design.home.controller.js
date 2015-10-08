(function (angular, window) {
    'use strict';
    angular
        .module('placesDesign')
        .controller('DesignHomeCtrl', ['$scope', 'Orders', 'COLLECTIONS', 'DB', '$timeout', 'Buildfire', 'placesInfo', function ($scope, Orders, COLLECTIONS, DB, $timeout, Buildfire, placesInfo) {
            var DesignHome = this
                , _data = {
                    content: {
                        images: [],
                        descriptionHTML: '',
                        description: '',
                        sortBy: Orders.ordersMap.Newest,
                        rankOfLastItem: ''
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
                , tmrDelay = null;

            /* populate VM with resolve */
            if (placesInfo) {
                DesignHome.placeInfo = placesInfo;
                DesignHome._lastSaved = angular.copy(DesignHome.placeInfo);
            }
            else {
                DesignHome.placeInfo = {data: angular.copy(_data)};
                DesignHome._lastSaved = angular.copy(DesignHome.placeInfo);
            }


            /*Buildfire DB Service*/

            DesignHome._placeCenter = new DB(COLLECTIONS.PlaceInfo);

            DesignHome.layouts = {
                itemListLayouts: [{name: "item-list-1"}, {name: "item-list-2"}],
                itemLayouts: [{name: "item-details-1"}, {name: "item-details-2"}, {name: "item-details-3"}],
                secListLayouts: [{name: "sec-list-1-1"}, {name: "sec-list-2-1"}, {name: "sec-list-3-1"}],
                mapLayouts: [{name: "map-1"}, {name: "map-2"}]
            };

            DesignHome.changeLayout = function (layoutName, type) {
                if (layoutName && DesignHome.placeInfo.data.design) {
                    DesignHome.placeInfo.data.design[type + "Layout"] = layoutName;
                }
            };
            DesignHome.addListBgImage = function () {
                var options = {showIcons: false, multiSelection: false}
                    , callback = function (error, result) {
                        if (error) {
                            console.error('Error:', error);
                        } else {
                            DesignHome.placeInfo.data.design.secListBGImage = result.selectedFiles && result.selectedFiles[0] || null;
                            $scope.$digest();
                        }
                    };
                Buildfire.imageLib.showDialog(options, callback);
            };
            DesignHome.removeListBgImage = function () {
                DesignHome.placeInfo.data.design.secListBGImage = null;
            };

            /**
             * function isUnchanged(data)
             * Used to check previously saved data object and updated data object are same or not
             * @param data
             * @returns {*|boolean}
             */
            function isUnchanged(data) {
                return angular.equals(data, DesignHome._lastSaved);
            }

            var updatefn = function (newObj) {
                if (newObj) {
                    if (tmrDelay) {
                        clearTimeout(tmrDelay);
                    }
                    if (isUnchanged(newObj)) {
                        return;
                    }
                    if (newObj.id) {
                        tmrDelay = $timeout(function () {
                            DesignHome._placeCenter.update(newObj.id, newObj.data).then(function (result) {
                                DesignHome._lastSaved = angular.copy(DesignHome.placeInfo);
                            }, function (err) {
                                console.log(err);
                                DesignHome.placeInfo = angular.copy(DesignHome._lastSaved);
                            });
                        }, 500);
                    } else {
                        tmrDelay = $timeout(function () {
                            DesignHome._placeCenter.save(DesignHome.placeInfo.data).then(function success(result) {
                                init();
                            }, function fail(err) {
                                console.log(err);
                            });
                        }, 500);
                    }
                }
            };
            $scope.$watch(function () {
                return DesignHome.placeInfo;
            }, updatefn, true);
        }]);
})(window.angular, window);
