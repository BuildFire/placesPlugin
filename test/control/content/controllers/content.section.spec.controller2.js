/*
describe('Unit : Controller - ContentSectionCtrl', function () {

// load the controller's module
    beforeEach(module('placesContent'));

    var $q, ContentSection, scope, $routeParams, DB, $timeout, COLLECTIONS, Orders, OrdersItems, AppConfig, Messaging, EVENTS, PATHS, $csv, Buildfire, Location;

    beforeEach(inject(function (_$q_, $controller, _$rootScope_, _DB_, _$timeout_, _COLLECTIONS_, _Orders_, _OrdersItems_, _AppConfig_, _Messaging_, _EVENTS_, _PATHS_, _$csv_, _Buildfire_, _Location_) {
            scope = _$rootScope_.$new();
            DB = _DB_;
            $timeout = _$timeout_;
            COLLECTIONS = _COLLECTIONS_;
            Orders = _Orders_;
            OrdersItems = _OrdersItems_;
            AppConfig = _AppConfig_;
            Messaging = _Messaging_;
            EVENTS = _EVENTS_;
            PATHS = _PATHS_;
            $csv = _$csv_;
            Location = _Location_;
            Buildfire = {
                components: {
                    carousel: {
                        editor: function (a) {
                            return {
                                loadItems: function () {
                                }
                            }
                        }
                    },
                    actionItems: {
                        sortableList: {}
                    }
                }
            };
            $q = _$q_;
            //Buildfire = _Buildfire_;
            //PlaceInfoData = _PlaceInfoData_;

            ContentSection = $controller('ContentSectionCtrl', {
                $scope: scope,
                //PlaceInfoData: {id: '1', data: {content: {sortBy: 'title'}}},
                DB: DB,
                $timeout: $timeout,
                COLLECTIONS: COLLECTIONS,
                Orders: Orders,
                OrdersItems: OrdersItems,
                AppConfig: AppConfig,
                Messaging: Messaging,
                EVENTS: EVENTS,
                PATHS: PATHS,
                $csv: $csv,
                Location: Location,
                placesInfo: null,
                sectionInfo: null,
                Buildfire: {
                    imageLib: {
                        showDialog: function () {
                            console.log('testing');
                            return (null, {selectedFiles: ['']});
                        }
                    }
                }
            });
        })
    )
    ;

    describe('Units: units should be Defined when data is null ', function () {
        it('it should pass if ContentSection is defined', function () {
            expect(ContentSection).not.toBeUndefined();
        });
    });
});*/