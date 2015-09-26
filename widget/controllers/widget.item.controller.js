(function (angular, window) {
    angular
        .module('placesWidget')
        .controller('WidgetItemCtrl', ['$scope', 'COLLECTIONS', 'DB', function ($scope, COLLECTIONS, DB) {
            var WidgetItem = this;
            WidgetItem.placeInfo = null;
            console.log('WidgetItemCtrl called');
            var PlaceInfo = new DB(COLLECTIONS.PlaceInfo);

            /**
             * init() private function
             * It is used to fetch previously saved user's data
             */
            var init = function () {
                var success = function (result) {
                        if (result && result.data && result.id) {
                            WidgetItem.placeInfo = result;
                        }
                    }
                    , error = function (err) {
                        console.error('Error while getting data', err);
                    };
                PlaceInfo.get().then(success, error);
            };

            /**
             * init() function invocation to fetch previously saved user's data from datastore.
             */
            init();
        }]);
})(window.angular, window);