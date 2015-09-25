(function (angular, window) {
    angular
        .module('placesWidget')
        .controller('WidgetItemCtrl', ['$scope','PlaceInfo', function ($scope,PlaceInfo) {
            var WidgetItem=this;
            WidgetItem.placeInfo=PlaceInfo;
            console.log('WidgetItemCtrl called');
        }]);
})(window.angular, window);