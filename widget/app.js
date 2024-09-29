(function (angular, buildfire) {
    'use strict';
    window.authFailureFired = false;

    //created mediaCenterWidget module
    angular
        .module('placesWidget', [
            'placesEnums',
            'placesWidgetServices',
            'placesWidgetFilters',
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
        .service('ScriptLoaderService', ['$q', function ($q) {
          this.loadScript = function () {
              const {apiKeys} = buildfire.getContext();
              const {googleMapKey} = apiKeys;

              const url = `https://maps.googleapis.com/maps/api/js?libraries=places&sensor=true&key=${googleMapKey}`;

              const deferred = $q.defer();

              // Check if the script is already in the document
              const existingScript = document.getElementById('googleMapsScript');
              if (existingScript) {
                  return deferred.resolve();
              }

              const script = document.createElement('script');
              script.type = 'text/javascript';
              script.src = url;
              script.id = 'googleMapsScript';

              script.onload = function () {
                  console.info(`Successfully loaded script: ${url}`);
                  deferred.resolve();
              };

              script.onerror = function () {
                  console.error(`Failed to load script: ${url}`);
                  deferred.reject('Failed to load script.');
              };
              window.gm_authFailure = () => {
                  if (window.authFailureFired) return;
                  buildfire.dialog.alert({
                      title: 'Error',
                      message: 'Failed to load Google Maps API.',
                  });
                  window.authFailureFired = true;
                  deferred.reject('Failed to load script.');
              };

              document.head.appendChild(script);
              return deferred.promise;
          };
      }])
        .run(['Location', 'Messaging', 'EVENTS', 'PATHS', '$location', '$rootScope', 'ViewStack', 'ScriptLoaderService','$q', function (Location, Messaging, EVENTS, PATHS, $location, $rootScope, ViewStack,ScriptLoaderService,$q) {

            // Create a global promise for Google Maps loading
            angular.module('placesWidget').googleMapsReady = $q.defer();

            ScriptLoaderService.loadScript()
              .then(function () {
                  // Resolve the global promise when the script is loaded
                  angular.module('placesWidget').googleMapsReady.resolve();
              })
              .catch(function (err) {
                  console.error('Google Maps failed to load:', err);
                  angular.module('placesWidget').googleMapsReady.reject(err);
              });


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
            buildfire.history.onPop(function(breadcrumb){
                if (breadcrumb &&  breadcrumb.source != 'plugin') {
                    while(ViewStack.hasViews()) {
                        ViewStack.pop({propagate: true});
                    }
                } else {
                     if (ViewStack.hasViews()) {
                        ViewStack.pop({propagate: true});
                     }
                }
            });
        }]);
})(window.angular, window.buildfire);
