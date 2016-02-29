describe('Unit : Controller - WidgetItemCtrl', function () {

// load the controller's module
    beforeEach(module('placesWidget'));

    var $q, WidgetItem, scope, COLLECTIONS, DB,  Buildfire, $rootScope, GeoDistance, Messaging, Location, EVENTS, PATHS, AppConfig, placesInfo, Orders, OrdersItems, item;

    beforeEach(inject(function (_$q_, $controller, _$rootScope_, _COLLECTIONS_, _DB_, _Buildfire_, _GeoDistance_, _Messaging_, _Location_, _EVENTS_, _PATHS_, _AppConfig_, _Orders_, _OrdersItems_) {
            $q = _$q_;
            scope = _$rootScope_.$new();

            COLLECTIONS = _COLLECTIONS_;
            DB = _DB_;
            Buildfire = _Buildfire_;
            GeoDistance = _GeoDistance_;
            Messaging = _Messaging_;
            Location = _Location_;
            EVENTS = _EVENTS_;
            PATHS = _PATHS_;
            AppConfig = _AppConfig_;
            Orders = _Orders_;
            OrdersItems = _OrdersItems_;


            WidgetItem = $controller('WidgetItemCtrl', {
                $scope: scope,
                DB: DB,
                COLLECTIONS: COLLECTIONS,
                Orders: Orders,
                OrdersItems: OrdersItems,
                Messaging: Messaging,
                EVENTS: EVENTS,
                PATHS: PATHS,
                Location: Location,
                AppConfig: AppConfig,
                placesInfo: {data: {design: {}, settings: {showDistanceIn: true}, content: {sortBy: 'Newest'}}},
                GeoDistance: GeoDistance,
                item : {data:{address:{lat:'22',lng:'28'}}}
            });
            WidgetItem.device={'platform':'ios'};
        })
    )
    ;


    describe('WidgetItem.showBodyContent', function () {

        it('should pass if it returns true when description is not the default html', function () {
            WidgetItem.item={data:{bodyContent : 'a'}};
            var result = WidgetItem.showBodyContent();
            expect(result).toEqual(true);
        });

        it('should pass if it returns true when description is not the default html', function () {
            WidgetItem.item={data:{bodyContent : '<p>&nbsp;<br></p>'}};
            var result = WidgetItem.showBodyContent();
            expect(result).not.toEqual(true);
        });
    });
       describe('WidgetItem.openMap', function () {
           it('should pass if it call map when WidgetItem.openMap is called', function () {
            WidgetItem.openMap();
            //expect().toEqual(true);
        });

        it('should pass if it call map when WidgetItem.openMap is called', function () {
            WidgetItem.device={'platform':'web'};
            WidgetItem.openMap();
            //expect().not.toEqual(true);
        });
    });
    describe('WidgetItem.executeAction', function () {
           it('should pass if it call map when WidgetItem.executeAction is called', function () {
            WidgetItem.executeAction({'title':'webPage','target':'buildfire.com'});
            //expect().toEqual(true);
        });
    });

});