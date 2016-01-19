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
                            secListBGImage: "bg.png"
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
                    },
                    components: {
                        images: {
                            thumbnail: function () {
                                this.loadbackground = function (url) {
                                };
                                this.onChange = function (url) {
                                };
                                this.onDelete = function (url) {
                                };
                                return this;

                            }
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

    describe('updateFn', function () {
        it('should make the background image property null', function () {
            controller.placeInfo.data.design.secListBGImage = 'Mno.png';
            $rootScope.$apply();
            //expect(controller.placeInfo.data.design.secListBGImage).toBeNull();
        });
        it('updateFn Unchanged', function () {
            controller.placeInfo = {
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
                        secListBGImage: "bg.png"
                    },
                    settings: {
                        defaultView: "list",
                        showDistanceIn: "miles"
                    }
                }
            };
            $rootScope.$apply();
            //expect(controller.placeInfo.data.design.secListBGImage).toBeNull();
        });
        it('updateFn When  id is not there', function () {
            controller.placeInfo = {
                data: {
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
                        secListBGImage: "bg.png"
                    },
                    settings: {
                        defaultView: "list",
                        showDistanceIn: "miles"
                    }
                }
            };
            $rootScope.$apply();
            //expect(controller.placeInfo.data.design.secListBGImage).toBeNull();
        });
    });


    xdescribe('Function :DesignHome.addItemListBackgroundImage', function () {
        it('DesignHome.addItemListBackgroundImage should exist and be a function', function () {
            expect(typeof controller.addListBgImage).toEqual('function');
        });
        it('it should Fail after DesignHome.addItemListBackgroundImage function call', function () {
            Buildfire.imageLib.showDialog.and.callFake(function () {
                var deferred = q.defer();
                deferred.reject({
                    code: '200',
                    message: 'OK'
                });
                return deferred.promise;
            });
            controller.addListBgImage();
            $rootScope.$digest();
            expect(controller.placeInfo.data.design.secListBGImage).toEqual('');
        });
        it('it should pass if DesignHome.data.design.itemDetailsBgImage is match the result after DesignHome.addItemListBackgroundImage function call', function () {
            ImageLibrary.showDialog.and.callFake(function () {
                var deferred = q.defer();
                deferred.resolve({
                    "selectedFiles": ["https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"],
                    "selectedIcons": []
                });
                return deferred.promise;
            });
            controller.addListBgImage();
            $rootScope.$digest();
            expect(controller.placeInfo.data.design.secListBGImage).toEqual('https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg');
        });
    });

});
describe("DesignHomeCtrl Undefined placeInfo", function () {

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
                placesInfo: null,
                $timeout: $injector.get('$timeout'),
                Buildfire: {
                    imageLib: {
                        showDialog: function (options, callback) {
                            controller._callback(null, {selectedFiles: ['test']});
                        }
                    },
                    components: {
                        images: {
                            thumbnail: function () {

                            }
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
    });
});
