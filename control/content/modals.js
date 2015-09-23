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
                            size: 'sm'
                        });
                    removePopupModal.result.then(function (imageInfo) {
                        removePopupDeferred.resolve(imageInfo);
                    }, function (err) {
                        //do something on cancel
                        removePopupDeferred.reject(err);
                    });
                    return removePopupDeferred.promise;
                }
            };
        }])
        .controller('RemovePopupCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            var RemovePopup = this;
            RemovePopup.ok = function () {
                $modalInstance.close('yes');
            };
            RemovePopup.cancel = function () {
                $modalInstance.dismiss('no');
            };
        }]);
})(window.angular, window.buildfire);
