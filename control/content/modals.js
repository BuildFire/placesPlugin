(function (angular, buildfire) {
    'use strict';
    if (!buildfire) {
        throw ("buildfire not found");
    }
    angular
        .module('placesModals', ['placesFilters', 'ui.bootstrap'])
        .factory('Modals', ['$modal', '$q','$timeout', function ($modal, $q,$timeout) {
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
                },
                selectAllItemImageModal: function (PlaceInfo) {
                    var selectImageDeferred = $q.defer();
                    var selectImagePopupModal = $modal
                        .open({
                            templateUrl: 'templates/modals/add-image-allitems.html',
                            controller: 'SelectImagePopupCtrl',
                            controllerAs: 'SelectImagePopup',
                            size: 'sm',
                            resolve: {
                                PlaceInfo: function () {
                                    return PlaceInfo;
                                }
                            }
                        });
                    selectImagePopupModal.result.then(function (_placeInfo) {
                        selectImageDeferred.resolve(_placeInfo);
                    }, function (err) {
                        //do something on cancel
                        selectImageDeferred.reject(err);
                    });
                    return selectImageDeferred.promise;
                }

            };
        }])
        .controller('RemovePopupCtrl', ['$scope', '$modalInstance', 'Info','$timeout', function ($scope, $modalInstance, Info,$timeout) {
            console.log('RemovePopup Controller called-----');
            $timeout(function () {
                console.log('Modal Top Changed');
                var top =  Info.event.pageY-50;
                $('.modal-dialog.modal-sm').offset({top: top, left: 0});
            }, 700);
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
        .controller('SelectImagePopupCtrl', ['$scope', '$modalInstance', 'PlaceInfo', 'Buildfire', function ($scope, $modalInstance, PlaceInfo, Buildfire) {
            var SelectImagePopup = this;
            if (PlaceInfo) {
                SelectImagePopup.PlaceInfo = PlaceInfo;
            }
            SelectImagePopup.selectImage = function () {
                var options = {showIcons: false, multiSelection: false}
                    , callback = function (error, result) {
                        if (error) {
                            console.error('Error:', error);
                        } else {
                            SelectImagePopup.PlaceInfo.data.content.allItemImage = result.selectedFiles && result.selectedFiles[0] || null;

                            if (!$scope.$$phase)$scope.$digest();
                        }
                    };
                Buildfire.imageLib.showDialog(options, callback);
            };
            SelectImagePopup.removeImage = function () {
                SelectImagePopup.PlaceInfo.data.content.allItemImage = null;
            };
            SelectImagePopup.ok = function () {
                $modalInstance.close(SelectImagePopup.PlaceInfo);
            };
            SelectImagePopup.cancel = function () {
                $modalInstance.dismiss();
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
