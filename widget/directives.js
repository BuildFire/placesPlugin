(function (angular) {
    angular
        .module('placesWidget')

        .directive('buildfireCarousel', function ($timeout) {
            return {
                restrict: 'E',
                replace: true,
                link: function (scope, elem, attrs) {
                    var view;

                    function initCarousel() {
                        $timeout(function () {
                            var imgs = scope.images || [];
                            modifySource(imgs);
                            view = new buildfire.components.carousel.view("#carousel", imgs);
                        });

                    }

                    function modifySource(arr) {
                        angular.forEach(arr, function (i) {
                            i.iconUrl = i.imageUrl;
                        });
                    }

                    initCarousel();


                    scope.$watch(function () {
                        return scope.images;
                    }, function (newValue, oldValue) {
                        var imgs = angular.copy(newValue);
                        modifySource(imgs);
                        if(view)
                        view.loadItems(imgs);
                    });

                },
                template: "<div id='carousel'></div>",
                scope: {
                    images: '='
                }
            }
        });
})(window.angular, undefined);
