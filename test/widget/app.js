describe('placesWidget: App', function () {
    beforeEach(module('placesWidget'));
    var location, route, rootScope;
    beforeEach(module('placesWidget', function ($provide) {
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
        function (_$location_, _$route_, _$rootScope_) {
            location = _$location_;
            route = _$route_;
            rootScope = _$rootScope_;
        }));
    describe('Home route', function () {
        beforeEach(inject(
            function ($httpBackend) {
                $httpBackend.expectGET('templates/home.html')
                    .respond(200);
                $httpBackend.expectGET('/')
                    .respond(200);
            }));

        it('should load the home page on successful load of /', function () {
            location.path('/');
            rootScope.$digest();
            expect(route.current.controller).toBe('WidgetSectionsCtrl')
        });
    });
    describe('Section route', function () {
        beforeEach(inject(
            function ($httpBackend) {
                $httpBackend.expectGET('templates/home.html')
                    .respond(200);
                $httpBackend.expectGET('/items/:sectionId')
                    .respond(200);
            }));

        it('should load the home page on successful load of /items/:sectionId', function () {
            location.path('/items/:sectionId');
            rootScope.$digest();
            expect(route.current.controller).toBe('WidgetSectionsCtrl')
        });
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
            expect(route.current.controller).toBe('WidgetItemCtrl')
        });
    });
    describe('Item ADD route', function () {
        beforeEach(inject(
            function ($httpBackend) {
                $httpBackend.expectGET('templates/item.html')
                    .respond(200);
                $httpBackend.expectGET('/item/:sectionId')
                    .respond(200);
            }));

        it('should load the home page on successful load of /item/:sectionId/:itemId', function () {
            location.path('/item/:sectionId');
            rootScope.$digest();
            expect(route.current.controller).toBe('WidgetItemCtrl')
        });
    });
});