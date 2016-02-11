describe('placesContent: App', function () {
    beforeEach(module('placesContent'));
    var location, route, rootScope, Messaging;
    beforeEach(module('placesContent', function ($provide) {
        $provide.service('Buildfire', function () {
            this.datastore = jasmine.createSpyObj('datastore', ['get','getById']);
            this.datastore.get.and.callFake(function (_tagName, callback) {
                if (_tagName) {
                    callback(null, {
                        data: {
                            design: {
                                itemListLayout: 'layout1',
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
            this.datastore.getById.and.callFake(function (_tagName,id, callback) {
                if (_tagName) {
                    callback(null, {
                        data: {
                            design: {
                                itemListLayout: 'layout1',
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
        });
    }));
    beforeEach(inject(
        function (_$location_, _$route_, _$rootScope_, _Messaging_) {
            location = _$location_;
            route = _$route_;
            rootScope = _$rootScope_;
            Messaging = _Messaging_;
        }));
    describe('Home route', function () {
        beforeEach(inject(
            function ($httpBackend) {
                $httpBackend.expectGET('templates/sections.html')
                    .respond(200);
                $httpBackend.expectGET('/')
                    .respond(200);
            }));

        it('should load the home page on successful load of /', function () {
            location.path('/');
            rootScope.$digest();
            expect(route.current.controller).toBe('ContentSectionsCtrl')
        });
        /* it("should test the $Messaging listener", inject(function (Messaging) {
         Messaging.sendToControl({name: 'Route_Change', message: {}});
         expect(Messaging.onReceivedMessage).hasBeenCalled();
         //expects for the listener
         }));*/
    });
    describe('Item route', function () {
        beforeEach(inject(
            function ($httpBackend) {
                $httpBackend.expectGET('templates/item.html')
                    .respond(200);
                $httpBackend.expectGET('/item/:sectionId/:itemId')
                    .respond(200);
            }));

        it('should load the home page on successful load of /item/:sectionId/:itemId', function () {
            location.path('/item/:sectionId/:itemId');
            rootScope.$digest();
            expect(route.current.controller).toBe('ContentItemCtrl')
        });
    });
    describe('Item route without Item Id', function () {
        beforeEach(inject(
            function ($httpBackend) {
                $httpBackend.expectGET('templates/item.html')
                    .respond(200);
                $httpBackend.expectGET('/item/:sectionId')
                    .respond(200);
            }));

        it('should load the home page on successful load of /item/:sectionId', function () {
            location.path('/item/:sectionId');
            rootScope.$digest();
            expect(route.current.controller).toBe('ContentItemCtrl')
        });
    });
    describe('Section route', function () {
        beforeEach(inject(
            function ($httpBackend) {
                $httpBackend.expectGET('templates/items.html')
                    .respond(200);
                $httpBackend.expectGET('/items/:sectionId')
                    .respond(200);
            }));

        it('should load the home page on successful load of /items/:sectionId', function () {
            location.path('/items/:sectionId');
            rootScope.$digest();
            expect(route.current.controller).toBe('ContentItemsCtrl')
        });
    });
    describe('Section ADD  route', function () {
        beforeEach(inject(
            function ($httpBackend) {
                $httpBackend.expectGET('templates/section.html')
                    .respond(200);
                $httpBackend.expectGET('/section')
                    .respond(200);
            }));

        it('should load the home page on successful load of /section', function () {
            location.path('/section');
            rootScope.$digest();
            expect(route.current.controller).toBe('ContentSectionCtrl')
        });
    });
    describe('Section Edit  route', function () {
        beforeEach(inject(
            function ($httpBackend) {
                $httpBackend.expectGET('templates/section.html')
                    .respond(200);
                $httpBackend.expectGET('/section/:sectionId')
                    .respond(200);
            }));

        it('should load the home page on successful load of /section/:sectionId', function () {
            location.path('/section/:sectionId');
            rootScope.$digest();
            expect(route.current.controller).toBe('ContentSectionCtrl')
        });
    });
});
