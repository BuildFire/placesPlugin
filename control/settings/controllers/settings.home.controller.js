(function (angular, window) {
    'use strict';
    angular
        .module('placesSettings')
        .controller('SettingsHomeCtrl', ['$scope', 'Orders', 'COLLECTIONS', 'DEFAULT_DATA', 'DB', '$timeout', 'OrdersItems', 'placesInfo', function ($scope, Orders, COLLECTIONS, DEFAULT_DATA, DB, $timeout, OrdersItems, placesInfo) {
            var SettingsHome = this
                , tmrDelay = null;
            SettingsHome._placeCenter = new DB(COLLECTIONS.PlaceInfo);


            /* populate VM with resolve */
            if (placesInfo) {
                SettingsHome.placeInfo = placesInfo;
                SettingsHome._lastSaved = angular.copy(SettingsHome.placeInfo);
            }
            else {
                SettingsHome.placeInfo = {data: angular.copy(DEFAULT_DATA.PLACE_INFO)};
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
                        $timeout.cancel(tmrDelay);
                    }
                    if (isUnchanged(newObj)) {
                        return;
                    }
                    if (newObj.id) {
                        tmrDelay = $timeout(function () {
                            SettingsHome._placeCenter.update(newObj.id, newObj.data).then(function (result) {
                                SettingsHome._lastSaved = angular.copy(SettingsHome.placeInfo);
                            }, function (err) {
                                console.error(err);
                                SettingsHome.placeInfo = angular.copy(SettingsHome._lastSaved);
                            });
                        }, 500);
                    } else {
                        tmrDelay = $timeout(function () {
                            SettingsHome._placeCenter.save(SettingsHome.placeInfo.data).then(function success(result) {
                            }, function fail(err) {
                                console.error(err);
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
