(function (angular, window) {
    'use strict';
    angular
        .module('placesSettings')
        .controller('SettingsHomeCtrl', ['$scope', 'COLLECTIONS', 'DB', '$timeout', 'Buildfire', 'EVENTS', 'Messaging', 'PlaceInfo', function ($scope, COLLECTIONS, DB, $timeout, Buildfire, EVENTS, Messaging, PlaceInfo) {
            var SettingsHome=this;
            console.log('controller loaded----', PlaceInfo);
            SettingsHome.placeInfo=PlaceInfo;
            SettingsHome.change = function (data) {
                console.log('Change function called----',data);
            };
        }]);
})(window.angular, window);
