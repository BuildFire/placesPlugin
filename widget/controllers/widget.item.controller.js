(function (angular, window) {
    angular
        .module('placesWidget')
        .controller('WidgetItemCtrl', ['$scope', 'COLLECTIONS', 'DB', '$routeParams', 'Buildfire', '$rootScope', function ($scope, COLLECTIONS, DB, $routeParams, Buildfire, $rootScope) {
            var WidgetItem = this, view = null;
            WidgetItem.placeInfo = null;
            console.log('WidgetItemCtrl called');
            WidgetItem.item={data:{}};
            var PlaceInfo = new DB(COLLECTIONS.PlaceInfo);
            var Items = new DB(COLLECTIONS.Items);
            if ($routeParams.itemId) {
                Items.getById($routeParams.itemId).then(
                    function (result) {
                        WidgetItem.item = result;
                        if(WidgetItem.item.data && WidgetItem.item.data.images)
                           initCarousel(WidgetItem.item.data.images);
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

            $rootScope.$on("Carousel:LOADED", function () {
                console.log('carousel added------', WidgetItem.item);
                if (!view) {
                    console.log('if------',view);
                    view = new Buildfire.components.carousel.view("#carousel", []);
                }
                if (WidgetItem.item && WidgetItem.item.data && WidgetItem.item.data.images && view) {
                    view.loadItems(WidgetItem.item.data.images);
                } else {
                    view.loadItems([]);
                }
            });

            Buildfire.datastore.onUpdate(function (event) {
                console.log('ON UPDATE called============', event);
                if(event.tag=='items' && event.data){
                    if(event.data.images)
                        initCarousel(event.data.images);
                }
            });

            function initCarousel(images){
                if(view){
                    view.loadItems(images);
                }
            }

            /**
             * init() function invocation to fetch previously saved user's data from datastore.
             */
            init();
        }]);
})(window.angular, window);