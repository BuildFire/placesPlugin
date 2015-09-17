(function (angular, window) {
    'use strict';
    angular
        .module('placesSettings')
        .controller('SettingsHomeCtrl', ['$scope', 'COLLECTIONS', 'DB', '$timeout', 'Buildfire', 'EVENTS', 'Messaging', 'PlaceInfo', function ($scope, COLLECTIONS, DB, $timeout, Buildfire, EVENTS, Messaging, PlaceInfo) {
            var SettingsHome = this;
            var placeInfo = new DB(COLLECTIONS.PlaceInfo);
            SettingsHome.placeInfo = PlaceInfo;
            SettingsHome._lastSaved = angular.copy(SettingsHome.placeInfo);
            SettingsHome.change = function () {
                placeInfo.update(SettingsHome.placeInfo.id, SettingsHome.placeInfo.data).then(function (result) {
                    /* sync lastSaved to latest value */
                    SettingsHome._lastSaved = angular.copy(SettingsHome.placeInfo);
                }, function (err) {
                    /* revert to previous value in case of error*/
                    SettingsHome.placeInfo = angular.copy(SettingsHome._lastSaved);
                });
            };
        }]);
})(window.angular, window);
