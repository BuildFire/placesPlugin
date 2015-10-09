describe('Unit : placesContent content.item.controller.js', function () {
    var ContentItem, scope, $rootScope, $controller, q, $timeout, $httpBackend, DB, Buildfire, COLLECTIONS, Location, $routeParams, Utils;
    beforeEach(module('placesContent'));

    beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _DB_, _$httpBackend_, _$timeout_, _Buildfire_, _COLLECTIONS_, _Location_, _Utils_, _$routeParams_) {
        $rootScope = _$rootScope_;
        q = _$q_;
        scope = $rootScope.$new();
        $controller = _$controller_;
        $timeout = _$timeout_;
        $httpBackend = _$httpBackend_;
        Utils = _Utils_;
        Buildfire = {
            components: {
                carousel: {
                    editor: {}
                },
                actionItems: {
                    sortableList: {}
                }
            }
        };
        Location = _Location_;
        COLLECTIONS = _COLLECTIONS_;
        $rootScope = _$rootScope_;
        DB = _DB_;
        Buildfire.components.carousel = jasmine.createSpyObj('Buildfire.components.carousel', ['editor', '', '']);
        Buildfire.components.actionItems = jasmine.createSpyObj('Buildfire.components.actionItems', ['sortableList', '', '']);
        Buildfire.components.carousel.editor.and.callFake(function () {
            return {
                loadItems: function () {
                    console.log("editor.loadItems hasbeen called");
                }
            };
        });
        Buildfire.components.actionItems.sortableList.and.callFake(function () {
            return {
                loadItems: function () {
                    console.log("sortableList.loadItems hasbeen called");
                }
            };
        });
    }));
    describe('Units:  DataStore.save returns success', function () {
        beforeEach(function () {
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
                Utils: Utils
            });
        });

        describe('Units: units should be Defined', function () {
            it('it should pass if ContentHome is defined', function () {
                expect(ContentItem).toBeDefined();
            });
            it('it should pass if Buildfire is defined', function () {
                expect(Buildfire).toBeDefined()
            });
        });

        describe('Function : ContentItem.editor.onAddItems ', function () {
            it('ContentItem.editor.onAddItems should be called', function () {
                var items = [{
                    action: null,
                    imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"
                }];
                ContentItem.item.data.images = null;
                ContentItem.editor.onAddItems(items);
                $rootScope.$digest();
                expect(ContentItem.item.data.images.length).toEqual(1);
            });
        });
        describe('Function : ContentItem.editor.onDeleteItem ', function () {
            it('ContentItem.editor.onDeleteItem should be called', function () {
                var item = {
                    action: null,
                    imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"
                };
                ContentItem.item.data.images = [item];
                ContentItem.editor.onDeleteItem(item, 0);
                $rootScope.$digest();
                expect(ContentItem.item.data.images.length).toEqual(0);
            });
        });
        describe('Function : ContentItem.editor.onItemChange ', function () {
            it('ContentItem.editor.onItemChange should be called', function () {
                var item = {
                    action: {
                        name: 'self'
                    },
                    imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"
                };
                ContentItem.item.data.images = [{
                    action: null,
                    imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"
                }];
                ContentItem.editor.onItemChange(item, 0);
                $rootScope.$digest();
                expect(ContentItem.item.data.images[0]).toEqual({
                    action: {
                        name: 'self'
                    },
                    imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"
                });
            });
        });
        describe('Function : ContentItem.editor.onOrderChange ', function () {
            it('ContentItem.editor.onOrderChange should be called', function () {
                var item = {
                    action: {
                        name: 'self'
                    },
                    imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164.jpg"
                };
                ContentItem.item.data.images = [
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
                ContentItem.editor.onOrderChange(item, 0, 1);
                $rootScope.$digest();
                expect(ContentItem.item.data.images[0]).toEqual({
                    action: null,
                    imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"
                });
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