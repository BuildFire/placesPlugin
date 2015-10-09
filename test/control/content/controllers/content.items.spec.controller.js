describe('Unit : Controller - ContentItemsCtrl', function () {

// load the controller's module
    beforeEach(module('placesContent'));

    var $q, ContentItems, scope, $routeParams, DB, COLLECTIONS, Modals, Orders, OrdersItems, Messaging, EVENTS, PATHS, Location, placesInfo;

    beforeEach(inject(function (_$q_, _$routeParams_, $controller, _$rootScope_, _DB_, _COLLECTIONS_, _Modals_, _Orders_, _OrdersItems_, _Messaging_, _EVENTS_, _PATHS_, _Location_) {
            scope = _$rootScope_.$new();
            DB = _DB_;
            COLLECTIONS = _COLLECTIONS_;
            Orders = _Orders_;
            OrdersItems = _OrdersItems_;
            Messaging = _Messaging_;
            EVENTS = _EVENTS_;
            PATHS = _PATHS_;
            Location = _Location_;
            $q = _$q_;
            Modals = _Modals_;
            //placesInfo = {data: {content: {}}};
            $routeParams = _$routeParams_;

            ContentItems = $controller('ContentItemsCtrl', {
                $scope: scope,
                $routeParams: $routeParams,
                DB: DB,
                COLLECTIONS: COLLECTIONS,
                Orders: Orders,
                OrdersItems: OrdersItems,
                Messaging: Messaging,
                EVENTS: EVENTS,
                PATHS: PATHS,
                Location: Location,
                Modals: Modals,
                placesInfo: {
                    data: {
                        content: {
                            images: [],
                            descriptionHTML: '<p>&nbsp;<br></p>',
                            description: '<p>&nbsp;<br></p>',
                            sortBy: 'Newest',
                            rankOfLastItem: '',
                            sortByItems: 'Newest'
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
                sectionInfo: {
                    data: {
                        mainImage: '',
                        secTitle: '',
                        secSummary: "This will be summary",
                        itemListBGImage: '',
                        sortBy: '',
                        rankOfLastItem: ''
                    },
                    id :'12312412'
                }
            });
        })
    )
    ;

    describe('Units: units should be Defined', function () {
        it('it should pass if ContentItems is defined', function () {
            expect(ContentItems).not.toBeUndefined();
        });
        it('it should pass if Location is defined', function () {
            expect(Location).not.toBeUndefined();
        });
        it('it should pass if DB is defined', function () {
            expect(DB).not.toBeUndefined();
        });
        it('it should pass if COLLECTIONS is defined', function () {
            expect(COLLECTIONS).not.toBeUndefined();
        });

        it('it should pass if Messaging function is defined', function () {
            expect(Messaging).not.toBeUndefined();
        });
        it('it should pass if EVENTS function is defined', function () {
            expect(EVENTS).not.toBeUndefined();
        });
        it('it should pass if PATHS function is defined', function () {
            expect(PATHS).not.toBeUndefined();
        });
        it('it should pass if ContentItems.info is defined', function () {
            expect(ContentItems.info).not.toBeUndefined();
        });
        it('it should pass if ContentItems.itemSortableOptions is defined', function () {
            expect(ContentItems.itemSortableOptions).not.toBeUndefined();
        });
    });

    xdescribe('ContentItems.editSections', function () {
        var Sections;
        beforeEach(inject(function () {
            /* spy = spyOn(window.Sections, 'find').and.callFake(function () {
             console.log(786);
             var deferred = $q.defer();
             deferred.resolve('Remote call result');
             return deferred.promise;
             });*/

            Sections = jasmine.createSpy().and.callFake(function () {
                console.log(786);
                var deferred = $q.defer();
                deferred.resolve('Remote call result');
                return deferred.promise;
            });
            ;

        }));
        it('it should pass if ContentItems.editSections calls Items.update', function () {
            ContentItems.editSections();
            expect(Sections).toHaveBeenCalled();
        });
    });

});

