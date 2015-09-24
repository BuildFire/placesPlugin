(function (angular, window) {
    angular
        .module('placesWidget')
        .controller('WidgetItemCtrl', ['$scope', function ($scope) {
            var WidgetItem=this;
            console.log('WidgetItemCtrl called');
        }]);
})(window.angular, window);