(function (angular, buildfire) {
    'use strict';
    if (!buildfire) {
        throw ("buildfire not found");
    }
    angular
        .module('placesModals', ['placesFilters', 'ui.bootstrap'])
        .factory('Modals', ['$modal', '$q', function ($modal, $q) {
            return {
                removePopupModal: function (info) {
                    var removePopupDeferred = $q.defer();
                    var removePopupModal = $modal
                        .open({
                            templateUrl: 'templates/modals/rm-section-modal.html',
                            controller: 'RemovePopupCtrl',
                            controllerAs: 'RemovePopup',
                            size: 'sm',
                            resolve: {
                                Info: function () {
                                    return info;
                                }
                            }
                        });
                    removePopupModal.result.then(function (imageInfo) {
                        removePopupDeferred.resolve(imageInfo);
                    }, function (err) {
                        //do something on cancel
                        removePopupDeferred.reject(err);
                    });
                    return removePopupDeferred.promise;
                },
                DeeplinkPopupModal: function (info) {
                    var DeeplinkPopupDeferred = $q.defer();
                    var DeeplinkPopupModal = $modal
                        .open({
                            templateUrl: 'templates/modals/deep-link-copy.html',
                            controller: 'DeepLinkPopupCtrl',
                            controllerAs: 'DeepLinkPopup',
                            size: 'sm',
                            resolve: {
                                Info: function () {
                                    return info;
                                }
                            }
                        });
                    DeeplinkPopupModal.result.then(function (imageInfo) {
                        DeeplinkPopupDeferred.resolve(imageInfo);
                    }, function (err) {
                        //do something on cancel
                        DeeplinkPopupDeferred.reject(err);
                    });
                    return DeeplinkPopupDeferred.promise;
                },
                editSectionModal: function (sections, info) {
                    var editSectionDeferred = $q.defer();
                    var editSectionPopupModal = $modal
                        .open({
                            templateUrl: 'templates/modals/edit-section-modal.html',
                            controller: 'ContentSectionPopupCtrl',
                            controllerAs: 'ContentSectionPopup',
                            size: 'sm',
                            resolve: {
                                Info: function () {
                                    return info;
                                },
                                Sections: function () {
                                    return sections;
                                }
                            }
                        });
                    editSectionPopupModal.result.then(function (imageInfo) {
                        editSectionDeferred.resolve(imageInfo);
                    }, function (err) {
                        //do something on cancel
                        editSectionDeferred.reject(err);
                    });
                    return editSectionDeferred.promise;
                }
            };
        }])
        .controller('RemovePopupCtrl', ['$scope', '$modalInstance', 'Info', function ($scope, $modalInstance, Info) {
            $scope.ok = function () {
                $modalInstance.close('yes');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('no');
            };
        }])
        .controller('DeepLinkPopupCtrl', ['$scope', '$modalInstance', 'Info', function ($scope, $modalInstance, Info) {
            var DeepLinkPopup = this;
            if (Info) {
                DeepLinkPopup.deepLinkUrl = Info;
            }
            DeepLinkPopup.ok = function () {
                $modalInstance.close('yes');
            };
            DeepLinkPopup.cancel = function () {
                $modalInstance.dismiss('no');
            };
        }])
        .controller('ContentSectionPopupCtrl', ['$scope', '$modalInstance', 'Info', 'Sections', function ($scope, $modalInstance, Info, Sections) {


            if (Info) {
                $scope.info = Info;
            }
            if (Sections) {
                $scope.sections = Sections;

                angular.forEach($scope.sections, function (value) {
                    value.data.selected = ($scope.info.data.sections.indexOf(value.id) >= 0);
                });
            }
            $scope.ok = function () {
                $scope.info.data.sections = [];
                angular.forEach($scope.sections, function (value) {
                    if (value.data.selected)
                        $scope.info.data.sections.push(value.id);
                });
                $modalInstance.close($scope.info);
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('no');
            };
        }]);
})(window.angular, window.buildfire);
