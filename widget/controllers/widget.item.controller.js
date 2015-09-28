(function (angular, window) {
    angular
        .module('placesWidget')
        .controller('WidgetItemCtrl', ['$scope', 'COLLECTIONS', 'DB', '$routeParams', 'Buildfire', function ($scope, COLLECTIONS, DB, $routeParams, Buildfire) {
            var WidgetItem = this;
            WidgetItem.placeInfo = null;
            console.log('WidgetItemCtrl called');
            var PlaceInfo = new DB(COLLECTIONS.PlaceInfo);
            var Items = new DB(COLLECTIONS.Items);
            if ($routeParams.itemId) {
                Items.getById($routeParams.itemId).then(
                    function (result) {
                        if (result && result.data)
                            WidgetItem.item = result;
                        WidgetItem.coordinates = [result.data.lat, result.data.lng];
                    },
                    function (err) {
                        console.error('Error while getting item-', err);
                    }
                );
            }
            else {
                WidgetItem.item = {
                    data: {
                        listImage: "",
                        itemTitle: "",
                        images: [],
                        summary: '',
                        bodyContent: '',
                        bodyContentHTML: "",
                        addressTitle: '',
                        sections: [],//array of section id
                        address: {
                            lat: "",
                            lng: "",
                            aName: ""
                        },
                        links: [], //  this will contain action links
                        backgroundImage: ""
                    }
                }
            }

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

            Buildfire.datastore.onUpdate(function (event) {
                console.log('ON UPDATE called============', event);
            });

            /**
             * init() function invocation to fetch previously saved user's data from datastore.
             */
            init();
        }]);
})(window.angular, window);