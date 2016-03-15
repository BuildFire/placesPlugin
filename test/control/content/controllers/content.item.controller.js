describe('Unit : placesContent content.item.controller.js', function () {
    var ContentItem, scope, $rootScope, $controller, q, $timeout, $httpBackend, DB, Buildfire, COLLECTIONS, Location, $routeParams, Utils;
    beforeEach(module('placesContent'));
    beforeEach(module('placesContent', function ($provide) {
        $provide.service('Buildfire', function () {
            this.datastore = jasmine.createSpyObj('datastore', ['get', 'save']);
            this.appearance = jasmine.createSpyObj('appearance', ['setHeaderVisibility']);
            this.appearance.setHeaderVisibility.and.callFake(function () {
            });
            this.datastore.get.and.callFake(function (_tagName, callback) {
                if (_tagName) {
                    callback(null, {
                        data: {
                            design: {
                                bgImage: ''
                            },
                            content: {
                                images: [{title: 'bg1.png'}]
                            }
                        }
                    });
                } else {
                    callback('Error', null);
                }
            });
            this.datastore.save.and.callFake(function (options, _tagName, callback) {
                if (_tagName) {
                    callback(null, [{
                        data: {
                            design: {
                                backgroundImage: '',
                                itemLayout: '',
                                listLayout: ''
                            },
                            content: {
                                sortBy: 'Newest'
                            }
                        }
                    }]);
                } else {
                    callback('Error', null);
                }
            });
            this.navigation={
                scrollTop:function(){
                    console.log('scroll Top called');
                }
            };
            this.components = {
                carousel: {
                    editor: function (id) {
                        this.loadItems = function () {
                        }
                    }
                },
                actionItems: {
                    sortableList: function(id){
                        this.loadItems=function () {
                            console.log("sortableList.loadItems hasbeen called");
                        };
                        return this;
                    }
                },
                images:{
                    thumbnail:function(options){
                        //cb([{title:'MNO.png'}],null);
                    }
                }
            };
            this.history={
                push:function(){},
                onPop:function(){},
                pop:function(){}
            };
        });
    }));

    beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _DB_, _$httpBackend_, _$timeout_, _Buildfire_, _COLLECTIONS_, _Location_, _Utils_, _$routeParams_) {
        $rootScope = _$rootScope_;
        q = _$q_;
        scope = $rootScope.$new();
        $controller = _$controller_;
        $timeout = _$timeout_;
        $httpBackend = _$httpBackend_;
        Utils = _Utils_;
        Buildfire =_Buildfire_;
        Location = _Location_;
        COLLECTIONS = _COLLECTIONS_;
        $rootScope = _$rootScope_;
        DB = _DB_;

        ContentItem = $controller('ContentItemCtrl', {
            $scope: scope,
            Buildfire: Buildfire,
            item: {
                data: {
                    listImage: '',
                    itemTitle: '',
                    images: [],
                    summary: '',
                    bodyContent: '',
                    bodyContentHTML: '',
                    addressTitle: '',
                    sections: ['123124234'],
                    address: {
                        lat: '28',
                        lng: '77',
                        aName: 'Office'
                    },
                    links: [],
                    backgroundImage: ''
                }
            },
            DB: DB,
            COLLECTIONS: COLLECTIONS,
            $routeScope: $rootScope,
            $timeout: $timeout,
            $routeParams: {
                sectionId: '123456'
            },
            Utils: Utils,
            DEFAULT_DATA: {},
            placesInfo: {}
        });
    }));

    describe('Units:  DataStore.save returns success', function () {
        /*  beforeEach(function () {

         });*/

        describe('Units: units should be Defined', function () {
            it('it should pass if ContentItem is defined', function () {
                expect(ContentItem).toBeDefined();
            });
            it('it should pass if Buildfire is defined', function () {
                expect(Buildfire).toBeDefined()
            });
            it('it should pass if ContentItem.clearData is defined', function () {
                expect(ContentItem.clearData).toBeDefined()
            });
        });

        describe('Function : ContentItem.clearData ', function () {
            it('ContentItem.clearData should be called', function () {
                ContentItem.currentAddress = null;
                ContentItem.clearData();
                $rootScope.$digest();
                expect(ContentItem.currentCoordinates).toEqual(null);
            });
        });
        describe('Function : ContentItem.removeBackgroundImage ', function () {
            xit('ContentItem.removeBackgroundImage should be called', function () {
                ContentItem.item.data.backgroundImage = 'image.png';
                ContentItem.removeBackgroundImage();
                $rootScope.$digest();
                expect(ContentItem.item.data.backgroundImage).toEqual(null);
            });
        });
        describe('Function : ContentItem.removeListImage ', function () {
            it('ContentItem.removeListImage should be called', function () {
                ContentItem.item.data.listImage = 'image.png';
                ContentItem.removeListImage();
                $rootScope.$digest();
                expect(ContentItem.item.data.listImage).toEqual(null);
            });
        });
        describe('Function : ContentItem.setLocation ', function () {
            it('ContentItem.removeListImage should be called', function () {
                var data = {
                    coordinates: ['28', '29'],
                    location: 'noida'
                };
                ContentItem.setLocation(data);
                $rootScope.$digest();
                expect(ContentItem.item.data.address).toEqual({
                    lng: '28',
                    lat: '29',
                    aName: 'noida'
                });
            });
        });
        describe('Function : ContentItem.setLocation ', function () {
            it('ContentItem.removeListImage should be called', function () {
                var data = {
                    coordinates: ['28', '29'],
                    location: 'noida'
                };
                ContentItem.setLocation(data);
                $rootScope.$digest();
                expect(ContentItem.currentAddress).toEqual('noida');
            });
        });
        describe('Function : ContentItem.setLocation ', function () {
            it('ContentItem.removeListImage should be called', function () {
                var data = {
                    coordinates: ['28', '29'],
                    location: 'noida'
                };
                ContentItem.setLocation(data);
                $rootScope.$digest();
                expect(ContentItem.currentCoordinates).toEqual(['28', '29']);
            });
        });
        describe('Function : ContentItem.linkEditor.onAddItems ', function () {
            it('ContentItem.linkEditor.onAddItems should be called', function () {
                var items = [{
                    action: null,
                    imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"
                }];
                ContentItem.item.data.links = null;
                ContentItem.linkEditor.onAddItems(items);
                $rootScope.$digest();
                expect(ContentItem.item.data.links.length).toEqual(1);
            });
        });
        describe('Function : ContentItem.linkEditor.onDeleteItem ', function () {
            it('ContentItem.linkEditor.onDeleteItem should be called', function () {
                var item = {
                    action: null,
                    imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"
                };
                ContentItem.item.data.links = [item];
                ContentItem.linkEditor.onDeleteItem(item, 0);
                $rootScope.$digest();
                expect(ContentItem.item.data.links.length).toEqual(0);
            });
        });
        describe('Function : ContentItem.linkEditor.onItemChange ', function () {
            it('ContentItem.linkEditor.onItemChange should be called', function () {
                var item = {
                    action: {
                        name: 'self'
                    },
                    imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"
                };
                ContentItem.item.data.links = [{
                    action: null,
                    imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"
                }];
                ContentItem.linkEditor.onItemChange(item, 0);
                $rootScope.$digest();
                expect(ContentItem.item.data.links[0]).toEqual({
                    action: {
                        name: 'self'
                    },
                    imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"
                });
            });
        });
        describe('Function : ContentItem.linkEditor.onOrderChange ', function () {
            it('ContentItem.linkEditor.onOrderChange should be called', function () {
                var item = {
                    action: {
                        name: 'self'
                    },
                    imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164.jpg"
                };
                ContentItem.item.data.links = [
                    {
                        action: {
                            name: 'self'
                        },
                        imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164.jpg"
                    },
                    {
                        action: null,
                        imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"
                    }];
                ContentItem.linkEditor.onOrderChange(item, 0, 1);
                $rootScope.$digest();
                expect(ContentItem.item.data.links[0]).toEqual({
                    action: null,
                    imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"
                });
            });
        });
    });
});
