(function (angular) {
    angular
        .module('placesWidget')
        .controller('WidgetHomeCtrl', ['$scope', '$window', 'DB', 'COLLECTIONS', '$rootScope', 'Buildfire', 'AppConfig', 'Messaging', 'EVENTS', 'PATHS', 'Location', 'Orders',
            function ($scope, $window, DB, COLLECTIONS, $rootScope, Buildfire, AppConfig, Messaging, EVENTS, PATHS, Location, Orders) {

                var WidgetHome = this;

                WidgetHome.data = {design:{secListLayout :'list-1'}};
            }]);
})(window.angular, undefined);