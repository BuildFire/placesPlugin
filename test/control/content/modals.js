describe('placesModals: Services', function () {
    var $modal, $q;
    beforeEach(module('placesModals'));
    beforeEach(module('placesFilters'));
    beforeEach(inject(function ($injector) {
        $q = $injector.get('$q');
    }));

    describe('Modals service', function () {
        var Modals;
        $modal = jasmine.createSpyObj('$modal', ['open']);
        beforeEach(inject(
            function (_Modals_) {
                Modals = _Modals_;
            }));
        it('Modals should exists', function () {
            expect(Modals).toBeDefined();
        });
        it('Modals.removePopupModal should exists', function () {
            expect(Modals.removePopupModal).toBeDefined();
        });
        it('when $modal.open invoked by removePopupModal and clicked Ok', function () {
            $modal.open.and.callFake(function (obj) {
                var deferred = $q.defer();
                obj.resolve.Info();
                deferred.resolve({});
                return {
                    result: deferred.promise
                };
            });
            Modals.removePopupModal({
                templateUrl: 'templates/modals/rm-section-modal.html',
                controller: 'RemovePopupCtrl',
                controllerAs: 'RemovePopup',
                size: 'sm',
                resolve: {
                    Info: function () {
                        return {};
                    }
                }
            });
        });
        it('when $modal.open invoked by DeeplinkPopupModal and clicked Ok', function () {
            $modal.open.and.callFake(function (obj) {
                var deferred = $q.defer();
                obj.resolve.Info();
                deferred.resolve({});
                return {
                    result: deferred.promise
                };
            });
            Modals.DeeplinkPopupModal({
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
        });
        it('when $modal.open invoked by editSectionModal and clicked Ok', function () {
            $modal.open.and.callFake(function (obj) {
                var deferred = $q.defer();
                obj.resolve.Info();
                deferred.resolve({});
                return {
                    result: deferred.promise
                };
            });
            Modals.editSectionModal({
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
        });
        it('when $modal.open invoked by selectAllItemImageModal and clicked Ok', function () {
            $modal.open.and.callFake(function (obj) {
                var deferred = $q.defer();
                obj.resolve.Info();
                deferred.resolve({});
                return {
                    result: deferred.promise
                };
            });
            Modals.selectAllItemImageModal({
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
        });
    });

    describe('Modals: RemovePopupCtrl Controller', function () {
        var scope, $modalInstance, Info, spy,RemovePopup;
        beforeEach(inject(function ($controller, _$rootScope_, _$modal_) {
                scope = _$rootScope_.$new();
                $modalInstance = {                    // Create a mock object using spies
                    close: jasmine.createSpy('modalInstance.close'),
                    dismiss: jasmine.createSpy('modalInstance.dismiss'),
                    result: {
                        then: jasmine.createSpy('modalInstance.result.then')
                    }
                };
                Info = {};
                RemovePopup = $controller('RemovePopupCtrl', {
                    $scope: scope,
                    $modalInstance: $modalInstance,//_$modal_.op,
                    Info: Info
                });
            })
        );
        it('RemovePopup should exists', function () {
            expect(scope.ok).toBeDefined();
        });
        it('scope.cancel should exists', function () {
            expect(scope.cancel).toBeDefined();
        });
        it('scope.ok should exists', function () {
            expect(scope.ok).toBeDefined();
        });
        it('scope.cancel should exists', function () {
            expect(scope.cancel).toBeDefined();
        });
        it('scope.ok should close modalInstance', function () {
            scope.ok();
            expect($modalInstance.close).toHaveBeenCalledWith('yes');
        });
        it('scope.ok should dismiss modalInstance', function () {
            scope.cancel();
            expect($modalInstance.dismiss).toHaveBeenCalledWith('no');
        });
    });
    describe('Modals: DeepLinkPopupCtrl Controller', function () {
        var scope, $modalInstance, Info, spy,DeepLinkPopup;
        beforeEach(inject(function ($controller, _$rootScope_, _$modal_) {
                scope = _$rootScope_.$new();
                $modalInstance = {                    // Create a mock object using spies
                    close: jasmine.createSpy('modalInstance.close'),
                    dismiss: jasmine.createSpy('modalInstance.dismiss'),
                    result: {
                        then: jasmine.createSpy('modalInstance.result.then')
                    }
                };
                Info = {};
                DeepLinkPopup = $controller('DeepLinkPopupCtrl', {
                    $scope: scope,
                    $modalInstance: $modalInstance,//_$modal_.op,
                    Info: Info
                });
            })
        );
        it('DeepLinkPopup should exists', function () {
            expect(DeepLinkPopup).toBeDefined();
        });
        it('DeepLinkPopup.cancel should exists', function () {
            expect(DeepLinkPopup.cancel).toBeDefined();
        });
        it('DeepLinkPopup.ok should exists', function () {
            expect(DeepLinkPopup.ok).toBeDefined();
        });
        it('DeepLinkPopup.cancel should exists', function () {
            expect(DeepLinkPopup.cancel).toBeDefined();
        });
        it('DeepLinkPopup.ok should close modalInstance', function () {
            DeepLinkPopup.ok();
            expect($modalInstance.close).toHaveBeenCalledWith('yes');
        });
        it('DeepLinkPopup.ok should dismiss modalInstance', function () {
            DeepLinkPopup.cancel();
            expect($modalInstance.dismiss).toHaveBeenCalledWith('no');
        });
    });
    describe('Modals: SelectImagePopupCtrl Controller', function () {
        var scope, $modalInstance, Info, spy,SelectImagePopup,Buildfire,$rootScope;
        beforeEach(inject(function ($controller, _$rootScope_, _$modal_) {
                scope = _$rootScope_.$new();
                $rootScope=_$rootScope_;
                $modalInstance = {                    // Create a mock object using spies
                    close: jasmine.createSpy('modalInstance.close'),
                    dismiss: jasmine.createSpy('modalInstance.dismiss'),
                    result: {
                        then: jasmine.createSpy('modalInstance.result.then')
                    }
                };
                Info = {data:{content:{allItemImage:'allitems.png'}}};
                Buildfire={};
                SelectImagePopup = $controller('SelectImagePopupCtrl', {
                    $scope: scope,
                    $modalInstance: $modalInstance,//_$modal_.op,
                    PlaceInfo: Info,
                    Buildfire:Buildfire
                });
            })
        );
        it('SelectImagePopup should exists', function () {
            expect(SelectImagePopup).toBeDefined();
        });
        it('SelectImagePopup.cancel should exists', function () {
            expect(SelectImagePopup.cancel).toBeDefined();
        });
        it('SelectImagePopup.ok should exists', function () {
            expect(SelectImagePopup.ok).toBeDefined();
        });
        it('SelectImagePopup.cancel should exists', function () {
            expect(SelectImagePopup.cancel).toBeDefined();
        });
        it('SelectImagePopup.ok should close modalInstance', function () {
            SelectImagePopup.ok();
            expect($modalInstance.close).toHaveBeenCalledWith({data:{content:{allItemImage:'allitems.png'}}});
        });
        it('SelectImagePopup.ok should dismiss modalInstance', function () {
            SelectImagePopup.cancel();
            expect($modalInstance.dismiss).toHaveBeenCalledWith();
        });
        it('SelectImagePopup.removeImage should remove the image', function () {
            SelectImagePopup.placeInfo={data:{content:{allItemImage:'abc.png'}}};
            SelectImagePopup.removeImage();
            $rootScope.$apply();
            expect(SelectImagePopup.placeInfo.data.content.allItemImage).toEqual('abc.png');
        });
        it('SelectImagePopup.selectImage should select the image Success', function () {
            Buildfire.imageLib={showDialog:function(options,cb){
                cb(null,{selectedFiles:['abc1.png']});
            }};
            SelectImagePopup.placeInfo={data:{content:{allItemImage:'abc.png'}}};
            SelectImagePopup.selectImage();
            $rootScope.$apply();
            expect(SelectImagePopup.placeInfo.data.content.allItemImage).toEqual('abc.png');
        });
        it('SelectImagePopup.selectImage should select the image Error', function () {
            Buildfire.imageLib={showDialog:function(options,cb){
                cb({Error:'Error'},null);
            }};
            SelectImagePopup.placeInfo={data:{content:{allItemImage:'abc.png'}}};
            SelectImagePopup.selectImage();
            $rootScope.$apply();
            expect(SelectImagePopup.placeInfo.data.content.allItemImage).toEqual('abc.png');
        });
    });
    describe('Modals: ContentSectionPopupCtrl Controller', function () {
        var scope, $modalInstance, Info, Sections,SelectImagePopup,$rootScope;
        beforeEach(inject(function ($controller, _$rootScope_, _$modal_) {
                scope = _$rootScope_.$new();
                $rootScope=_$rootScope_;
                $modalInstance = {                    // Create a mock object using spies
                    close: jasmine.createSpy('modalInstance.close'),
                    dismiss: jasmine.createSpy('modalInstance.dismiss'),
                    result: {
                        then: jasmine.createSpy('modalInstance.result.then')
                    }
                };
                Info = {data:{sections:['id1','id2']}};
                Sections=[{id:'id1',data:{selected:'1'}},{id:'id2',data:{selected:'2'}}];
               $controller('ContentSectionPopupCtrl', {
                    $scope: scope,
                    $modalInstance: $modalInstance,//_$modal_.op,
                    Info: Info,
                   Sections:Sections
                });
            })
        );
        it('scope.cancel should exists', function () {
            expect(scope.cancel).toBeDefined();
        });
        it('scope.ok should exists', function () {
            expect(scope.ok).toBeDefined();
        });
        it('scope.cancel should exists', function () {
            expect(scope.cancel).toBeDefined();
        });
        it('scope.ok should close modalInstance', function () {
            scope.ok();
            expect($modalInstance.close).toHaveBeenCalledWith({data:{sections:['id1','id2']}});
        });
        it('scope.ok should dismiss modalInstance', function () {
            scope.cancel();
            expect($modalInstance.dismiss).toHaveBeenCalledWith('no');
        });
    });
});
