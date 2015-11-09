(function (angular, window) {
    'use strict';
    angular
        .module('placesSettings')
        .controller('SettingsHomeCtrl', ['$scope', 'Orders', 'COLLECTIONS', 'DB', '$timeout', 'OrdersItems', 'placesInfo', function ($scope, Orders, COLLECTIONS, DB, $timeout, OrdersItems, placesInfo) {
            var SettingsHome = this
                , _data = {
                    content: {
                        images: [],
                        descriptionHTML: '<p>&nbsp;<br></p>',
                        description: '<p>&nbsp;<br></p>',
                        sortBy: Orders.ordersMap.Manually,
                        rankOfLastItem: '',
                        sortByItems: OrdersItems.ordersMap.Newest,
                        showAllItems: 'true',
                        allItemImage: ''
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
                        showDistanceIn: "mi"
                    }
                }
                , tmrDelay = null;
            SettingsHome._placeCenter = new DB(COLLECTIONS.PlaceInfo);


            /* populate VM with resolve */
            if (placesInfo) {
                SettingsHome.placeInfo = placesInfo;
                SettingsHome._lastSaved = angular.copy(SettingsHome.placeInfo);
            }
            else {
                SettingsHome.placeInfo = {data: angular.copy(_data)};
                SettingsHome._lastSaved = angular.copy(SettingsHome.placeInfo);
            }

            /**
             * function isUnchanged(data)
             * Used to check previously saved data object and updated data object are same or not
             * @param data
             * @returns {*|boolean}
             */
            function isUnchanged(data) {
                return angular.equals(data, SettingsHome._lastSaved);
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
                            SettingsHome._placeCenter.update(newObj.id, newObj.data).then(function (result) {
                                SettingsHome._lastSaved = angular.copy(SettingsHome.placeInfo);
                            }, function (err) {
                                console.log(err);
                                SettingsHome.placeInfo = angular.copy(SettingsHome._lastSaved);
                            });
                        }, 500);
                    } else {
                        tmrDelay = $timeout(function () {
                            SettingsHome._placeCenter.save(SettingsHome.placeInfo.data).then(function success(result) {
                                init();
                            }, function fail(err) {
                                console.log(err);
                            });
                        }, 500);
                    }
                }
            };
            $scope.$watch(function () {
                return SettingsHome.placeInfo;
            }, updatefn, true);
        }]);
})(window.angular, window);
