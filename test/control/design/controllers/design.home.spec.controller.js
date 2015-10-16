describe("DesignHomeCtrl", function () {

    var $rootScope,
        $scope,
        controller,
        q,
        Buildfire;


    beforeEach(function () {
        module('placesDesign');

        inject(function ($injector, $q, _Buildfire_) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            controller = $injector.get('$controller')('DesignHomeCtrl', {
                $scope: $scope,
                Orders: $injector.get('Orders'),
                COLLECTIONS: $injector.get('COLLECTIONS'),
                DB: $injector.get('DB'),
                placesInfo: {
                    id: '1', data: {
                        content: {
                            images: [],
                            descriptionHTML: '',
                            description: '',
                            sortBy: 'Newest',
                            rankOfLastItem: ''
                        },
                        design: {
                            secListLayout: "sec-list-1-1",
                            mapLayout: "map-1",
                            itemListLayout: "item-list-1",
                            itemDetailsLayout: "item-details-1",
                            secListBGImage: ""
                        },
                        settings: {
                            defaultView: "list",
                            showDistanceIn: "miles"
                        }
                    }
                },
                $timeout: $injector.get('$timeout'),
                Buildfire: {
                    imageLib: {
                        showDialog: function (options, callback) {
                            controller._callback(null, {selectedFiles: ['test']});
                        }
                    }
                }
            });
            Buildfire = {
                imageLib: {
                    showDialog: function (options, callback) {
                        controller._callback(null, {selectedFiles: ['test']});
                    }
                }
            };
            q = $q;
        });
    });


    describe('Initialization', function () {
        it('should initialize the listLayouts to the default value', function () {
            expect(controller.layouts.itemListLayouts.length).toEqual(2);
        });

        it('should initialize the itemLayouts to the default value', function () {
            expect(controller.layouts.itemLayouts.length).toEqual(3);
        });

        it('should initialize the secListLayouts to the default value', function () {
            expect(controller.layouts.secListLayouts.length).toEqual(3);
        });

        it('should initialize the itemLayouts to the default value', function () {
            expect(controller.layouts.mapLayouts.length).toEqual(2);
        });
    });

    describe('changeLayout', function () {
        it('should change the value of placeInfo list when called for list', function () {
            controller.changeLayout('test', 'list');
            expect(controller.placeInfo.data.design["listLayout"]).toEqual('test');
        });

        it('should change the value of placeInfo item when called for item', function () {
            controller.changeLayout('test', 'item');
            expect(controller.placeInfo.data.design["itemLayout"]).toEqual('test');
        });

        it('should do nothing if layout is null', function () {
            controller.placeInfo.data.design["itemLayout"] = 'test';
            controller.changeLayout(null, 'item');
            expect(controller.placeInfo.data.design["itemLayout"]).toEqual('test');
        });

        it('should do nothing if layout is undefined', function () {
            controller.placeInfo.data.design["itemLayout"] = 'test';
            controller.changeLayout(undefined, 'item');
            expect(controller.placeInfo.data.design["itemLayout"]).toEqual('test');
        });

        it('should do nothing if placeInfo.data.design is undefined', function () {
            controller.placeInfo.data.design = undefined;
            controller.changeLayout('test', 'item');
            expect(controller.placeInfo.data.design).toBeUndefined();
        });


        it('should do nothing if placeInfo.data.design is null', function () {
            controller.placeInfo.data.design = null;
            controller.changeLayout('test', 'item');
            expect(controller.placeInfo.data.design).toBeNull();
        });
    });

    describe('removeListBgImage', function () {
        it('should make the background image property null', function () {
            controller.removeListBgImage();
            expect(controller.placeInfo.data.design.secListBGImage).toBeNull();
        });
    });



    //xdescribe('Function :DesignHome.addItemListBackgroundImage', function () {
    //    it('DesignHome.addItemListBackgroundImage should exist and be a function', function () {
    //        expect(typeof controller.addListBgImage).toEqual('function');
    //    });
    //    it('it should Fail after DesignHome.addItemListBackgroundImage function call', function () {
    //        Buildfire.imageLib.showDialog.and.callFake(function () {
    //            var deferred = q.defer();
    //            deferred.reject({
    //                code: '200',
    //                message: 'OK'
    //            });
    //            return deferred.promise;
    //        });
    //        controller.addListBgImage();
    //        $rootScope.$digest();
    //        expect(controller.placeInfo.data.design.secListBGImage).toEqual('');
    //    });
    //    it('it should pass if DesignHome.data.design.itemDetailsBgImage is match the result after DesignHome.addItemListBackgroundImage function call', function () {
    //        ImageLibrary.showDialog.and.callFake(function () {
    //            var deferred = q.defer();
    //            deferred.resolve({
    //                "selectedFiles": ["https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"],
    //                "selectedIcons": []
    //            });
    //            return deferred.promise;
    //        });
    //        controller.addListBgImage();
    //        $rootScope.$digest();
    //        expect(controller.placeInfo.data.design.secListBGImage).toEqual('https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg');
    //    });
    //});

    describe('watcher of controller.placeInfo', function () {

        it('should change the lastSaved when PlaceInfo is changed succesfully on db', function () {
            controller._lastSaved = null;
            controller._placeCenter.update = function () {
                var deferred = q.defer();
                deferred.resolve('Remote call result');
                return deferred.promise;
            };
            //controller.placeInfo = {};
            controller.placeInfo.data.design.secListBGImage = 'test';
            //controller.removeListBgImage();
            $scope.$digest();
            expect(controller._lastSaved).toBeNull();
        });

        it('should revert the PlaceInfo to lastSaved when db change failed', function () {
            //controller._lastSaved = null;
            controller._placeCenter.update = function () {
                var deferred = q.defer();
                deferred.reject('Remote call result');
                return deferred.promise;
            };

            controller.removeListBgImage();
            $scope.$digest();
            expect(controller.placeInfo.data.design.secListBGImage).toEqual(null);
        });
    });

});