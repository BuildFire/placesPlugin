describe('Unit : Controller - ContentItemsCtrl When placesInfo is null', function () {

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
                placesInfo: null,
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
        it('it should pass if ContentItems.info is defined when placesInfo is null', function () {
            expect(ContentItems.info).not.toBeUndefined();
        });
    });
});

