describe('Unit : Controller - WidgetItemCtrl', function () {

// load the controller's module
    beforeEach(module('placesWidget'));

    var $q, $controller, scope, $window, DB, COLLECTIONS, Buildfire, $rootScope, AppConfig, Messaging, EVENTS, PATHS, Location, Orders, DEFAULT_VIEWS, GeoDistance, $routeParams, OrdersItems;

    beforeEach(inject(function (_$q_, _$routeParams_, _$controller_, _$rootScope_, _Buildfire_, _DB_, _COLLECTIONS_, _AppConfig_, _Messaging_, _EVENTS_, _PATHS_, _Location_, _Orders_, _GeoDistance_, _$routeParams_, _$timeout_, _OrdersItems_) {
            scope = _$rootScope_.$new();
            DB = _DB_;
            $controller = _$controller_;
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
            $rootScope:_$rootScope_;
            Buildfire = {
                components: {
                    carousel: {
                        view: {}
                    },
                    actionItems: {
                        sortableList: {}
                    }
                },
                datastore: {
                    onUpdate: {}
                }
            };
            Location = _Location_;
            COLLECTIONS = _COLLECTIONS_;
            $rootScope = _$rootScope_;
            DB = _DB_;
            Buildfire.components.carousel = jasmine.createSpyObj('Buildfire.components.carousel', ['view', '', '']);
            Buildfire.components.actionItems = jasmine.createSpyObj('Buildfire.components.actionItems', ['sortableList', '', '']);
            Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['onUpdate', '', '']);
            Buildfire.components.carousel.view.and.callFake(function () {
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
            Buildfire.datastore.onUpdate.and.callFake(function () {
                return {
                    tag: 'items',
                    data: {
                        listImage: "list.png",
                        itemTitle: "",
                        images: [],
                        summary: '',
                        bodyContent: '',
                        bodyContentHTML: "",
                        addressTitle: '',
                        sections: [],//array of section id
                        address: {
                            lat: "",
                            lng: "",
                            aName: ""
                        },
                        links: [], //  this will contain action links
                        backgroundImage: "abc.png"
                    },
                    id: '12344'
                };
            });
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
                placesInfo: {data: {design: {}, settings: {showDistanceIn: true}, content: {sortBy: 'Newest'}}},
                GeoDistance: GeoDistance,
                item: {
                    data: {
                        listImage: "",
                        itemTitle: "",
                        images: [],
                        summary: '',
                        bodyContent: '',
                        bodyContentHTML: "",
                        addressTitle: '',
                        sections: [],//array of section id
                        address: {
                            lat: "28",
                            lng: "77",
                            aName: ""
                        },
                        links: [], //  this will contain action links
                        backgroundImage: "bg.png"
                    }
                }
            });
        })
    );

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