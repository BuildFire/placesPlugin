describe('Unit : Controller - WidgetItemCtrl2', function () {

// load the controller's module
    beforeEach(module('placesWidget'));

    var $q, WidgetItem, scope, COLLECTIONS, DB, $routeParams, Buildfire, $rootScope, GeoDistance, Messaging, Location, EVENTS, PATHS, AppConfig, $timeout, Orders, OrdersItems, item;

    beforeEach(inject(function (_$q_, _$routeParams_, $controller, _$rootScope_, _Buildfire_, _DB_, _COLLECTIONS_, _AppConfig_, _Messaging_, _EVENTS_, _PATHS_, _Location_, _Orders_, _GeoDistance_, _$timeout_, _OrdersItems_) {
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
            AppConfig = _AppConfig_;
            $routeParams = _$routeParams_;
            GeoDistance = _GeoDistance_;
            Buildfire = _Buildfire_;
            $rootScope = _$rootScope_;
            $timeout=_$timeout_;
            WidgetItem = $controller('WidgetItemCtrl', {
                $scope: scope,
                $routeParams: $routeParams,
                DB: DB,
                COLLECTIONS: COLLECTIONS,
                Buildfire: Buildfire,
                $rootScope: $rootScope,
                Orders: Orders,
                OrdersItems: OrdersItems,
                Messaging: Messaging,
                EVENTS: EVENTS,
                PATHS: PATHS,
                Location: Location,
                AppConfig: AppConfig,
                placesInfo: null,
                GeoDistance: GeoDistance,
                item: null
            });
        })
    )
    ;

    describe('Units: units should be Defined', function () {
        it('it should pass if WidgetSections is defined', function () {
            expect(WidgetItem).not.toBeUndefined();
        });
        xit('it should pass if $timeout', function () {
          $timeout.flush();
        });
    });
});
