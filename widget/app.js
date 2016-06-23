(function (angular, buildfire) {
    'use strict';
    //created mediaCenterWidget module
    angular
        .module('placesWidget', [
            'placesEnums',
            'placesWidgetServices',
            'placesWidgetFilters',
            'ngAnimate',
            'ui.bootstrap',
            'infinite-scroll',
            'rzModule'
        ])
        //injected ngRoute for routing
        //injected ui.bootstrap for angular bootstrap component
        //injected ui.sortable for manual ordering of list
        //ngClipboard to provide copytoclipboard feature
        .config(['$httpProvider', '$compileProvider', function ($httpProvider, $compileProvider) {

            /**
             * Disable the pull down refresh
             */
            //buildfire.datastore.disableRefresh();


            /**
             * To make href urls safe on mobile
             */
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|cdvfile|file):/);


            var interceptor = ['$q', function ($q) {
                var counter = 0;
                return {

                    request: function (config) {
                        buildfire.spinner.show();
                        counter++;
                        return config;
                    },
                    response: function (response) {
                        counter--;
                        if (counter === 0) {
                            buildfire.spinner.hide();
                        }
                        return response;
                    },
                    responseError: function (rejection) {
                        counter--;
                        if (counter === 0) {
                            buildfire.spinner.hide();
                        }

                        return $q.reject(rejection);
                    }
                };
            }];

            $httpProvider.interceptors.push(interceptor);

        }])
        .run(['Location', 'Messaging', 'EVENTS', 'PATHS', '$location', '$rootScope', 'ViewStack', function (Location, Messaging, EVENTS, PATHS, $location, $rootScope, ViewStack) {

            buildfire.deeplink.getData(function (data) {
                if (data) {
                    console.log('data---', data);
                    Location.go("#/item/" + JSON.parse(data).id);
                }

            });
/*
            buildfire.navigation.onBackButtonClick = function () {
                if (ViewStack.hasViews()) {
                    ViewStack.pop({propagate: true});
                } else {
                    buildfire.navigation._goBackOne();
                }
            };*/
        }])
        .run(['ViewStack', function (ViewStack) {
            buildfire.history.onPop(function(err,data){
                if (ViewStack.hasViews()) {
                    ViewStack.pop({propagate: true});
                }
            });
        }]);
})(window.angular, window.buildfire);