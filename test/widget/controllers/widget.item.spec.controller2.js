describe('Unit : Controller - WidgetItemCtrl2', function () {

// load the controller's module
    beforeEach(module('placesWidget'));

    var $q, WidgetSections, scope, $window, DB, COLLECTIONS, Buildfire, $rootScope, AppConfig, Messaging, EVENTS, PATHS, Location, Orders, DEFAULT_VIEWS, GeoDistance, $routeParams, OrdersItems;

    beforeEach(inject(function (_$q_, _$routeParams_, $controller, _$rootScope_, _Buildfire_, _DB_, _COLLECTIONS_, _AppConfig_, _Messaging_, _EVENTS_, _PATHS_, _Location_, _Orders_, _GeoDistance_, _$routeParams_, _$timeout_, _OrdersItems_) {
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
            $rootScope:_$rootScope_;
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

    //xdescribe('Units: units should be Defined', function () {
    //    it('it should pass if WidgetSections is defined', function () {
    //        expect(WidgetItem).not.toBeUndefined();
    //    });
    //});
});
