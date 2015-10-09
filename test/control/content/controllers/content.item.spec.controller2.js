describe('Unit : placesContent content.item.controller2.js', function () {
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
        Buildfire = _Buildfire_;
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
    describe('Units:  DataStore.save returns item =null', function () {
        beforeEach(function () {
            ContentItem = $controller('ContentItemCtrl', {
                $scope: scope,
                Buildfire: Buildfire,
                item: null,
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
            it('it should pass if ContentItem.item is defined when item=null', function () {
                expect(ContentItem.item).toBeDefined();
            });
        });
    });
});