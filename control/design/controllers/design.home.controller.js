(function (angular, window) {
    'use strict';
    angular
        .module('placesDesign')
        .controller('DesignHomeCtrl', ['$scope', 'COLLECTIONS', 'DB', 'PlaceCenterInfo', '$timeout', 'Buildfire', 'EVENTS', 'Messaging', function ($scope, COLLECTIONS, DB, PlaceCenterInfo, $timeout, Buildfire, EVENTS, Messaging) {
            var DesignHome = this;
            /* populate VM with resolve */
            DesignHome.placeInfo = PlaceCenterInfo;

            DesignHome._lastSaved = angular.copy(DesignHome.placeInfo);

            /*Buildfire DB Service*/

            DesignHome._placeCenter = new DB(COLLECTIONS.PlaceInfo);
            var PlaceCenter = DesignHome._placeCenter;

            DesignHome.layouts = {
                listLayouts: [{name: "list-1"}, {name: "list-2"}, {name: "list-3"}, {name: "list-4"}],
                itemLayouts: [{name: "item-1"}, {name: "item-2"}]
            };
            DesignHome.changeLayout = function (layoutName, type) {
                if (layoutName && DesignHome.placeInfo.data.design) {
                    DesignHome.placeInfo.data.design[type + "Layout"] = layoutName;
                }
            };

            var callback = function (error, result) {
                if (error) {
                    console.error('Error:', error);
                } else {
                    DesignHome.placeInfo.data.design.backgroundImage = result.selectedFiles && result.selectedFiles[0] || null;
                    $scope.$digest();
                }
            };

            DesignHome._callback = callback;

            var options = {showIcons: false, multiSelection: false};
            DesignHome.addBackgroundImage = function () {
                Buildfire.imageLib.showDialog(options, callback);
            };
            DesignHome.removeBackgroundImage = function () {
                DesignHome.placeInfo.data.design.backgroundImage = null;
            };

            $scope.$watch(function () {
                return DesignHome.placeInfo;
            }, function () {
                    PlaceCenter.update(DesignHome.placeInfo.id, DesignHome.placeInfo.data).then(function () {
                        /* sync lastSaved to latest value */
                        DesignHome._lastSaved = angular.copy(DesignHome.placeInfo);
                        ///on Control when a user drills to a section reflect the same on the widget
                    }, function () {
                        /* revert to previous value in case of error*/
                        DesignHome.placeInfo = angular.copy(DesignHome._lastSaved);
                    });

            }, true);
            /*Background image area ends*/
        }]);
})(window.angular, window);
