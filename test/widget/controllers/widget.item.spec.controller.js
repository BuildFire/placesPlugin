describe('Unit : Controller - WidgetItemCtrl', function () {

// load the controller's module
    beforeEach(module('placesWidget'));

    var $q, WidgetItem, scope, COLLECTIONS, DB, $routeParams, Buildfire, $rootScope, GeoDistance, Messaging, Location, EVENTS, PATHS, AppConfig, placesInfo, Orders, OrdersItems, item;

    beforeEach(inject(function (_$q_, _$routeParams_, $controller, _$rootScope_, _COLLECTIONS_, _DB_, _Buildfire_, _GeoDistance_, _Messaging_, _Location_, _EVENTS_, _PATHS_, _AppConfig_, _Orders_, _OrdersItems_) {
            $q = _$q_;
            $routeParams = _$routeParams_;
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
                $routeParams: $routeParams,
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
                item : {data:{}}
            });
        })
    )
    ;


    describe('WidgetItem.showBodyContent', function () {

        it('should pass if it returns true when description is not the default html', function () {
            WidgetItem.item.data.bodyContent = 'a';
            var result = WidgetItem.showBodyContent();
            expect(result).toEqual(true);
        });

        it('should pass if it returns true when description is not the default html', function () {
            WidgetItem.item.data.bodyContent = '<p>&nbsp;<br></p>';
            var result = WidgetItem.showBodyContent();
            expect(result).not.toEqual(true);
        });
    });





    //xdescribe('Units: units should be Defined', function () {
    //    it('it should pass if WidgetSections is defined', function () {
    //        expect(WidgetItem).not.toBeUndefined();
    //    });
    //});
    //xdescribe('Unit : widget.home.controller unit tests when  DataStore.get call Error', function () {
    //    beforeEach(function () {
    //        Buildfire.datastore.onUpdate.and.callFake(function () {
    //            return {
    //                tag: 'items',
    //                data: {
    //                    listImage: "list.png",
    //                    itemTitle: "",
    //                    images: [],
    //                    summary: '',
    //                    bodyContent: '',
    //                    bodyContentHTML: "",
    //                    addressTitle: '',
    //                    sections: [],//array of section id
    //                    address: {
    //                        lat: "",
    //                        lng: "",
    //                        aName: ""
    //                    },
    //                    links: [], //  this will contain action links
    //                    backgroundImage: "abc.png"
    //                },
    //                id: '12344'
    //            };
    //        });
    //        WidgetItem = $controller('WidgetItemCtrl', {
    //            $scope: scope,
    //            $routeParams: $routeParams,
    //            DB: DB,
    //            COLLECTIONS: COLLECTIONS,
    //            Buildfire: Buildfire,
    //            $rootScope: $rootScope,
    //            Orders: Orders,
    //            OrdersItems: OrdersItems,
    //            Messaging: Messaging,
    //            EVENTS: EVENTS,
    //            PATHS: PATHS,
    //            Location: Location,
    //            AppConfig: AppConfig,
    //            placesInfo: {data: {design: {}, settings: {showDistanceIn: true}, content: {sortBy: 'Newest'}}},
    //            GeoDistance: GeoDistance,
    //            item: null
    //        });
    //    });
    //    it('WidgetItem.item should be null', function () {
    //        $rootScope.$digest();
    //        expect(WidgetItem.item).toEqual(null);
    //    });
    //});
});