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

    describe('Units: units should be Defined', function () {
        it('it should pass if ContentSection is defined', function () {
            expect(ContentSection).not.toBeUndefined();
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
        it('it should pass if AppConfig is defined', function () {
            expect(AppConfig).not.toBeUndefined();
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
    });

    describe('ContentSection.selectMainImage', function () {


        it('it should pass if it changes the mainImage on correct input', function () {
            ContentSection.selectMainImage();
            expect(ContentSection.section.data.mainImage).toEqual('');
        })
    });

    describe('ContentSection.removeMainImage', function () {


        it('it should pass if it gives blank value to the mainImage', function () {
            ContentSection.section.data.mainImage = 'test';
            ContentSection.removeMainImage();
            expect(ContentSection.section.data.mainImage).toEqual('');
        })
    });

    describe('ContentSection.selectListBGImage', function () {


        it('it should pass if it changes the ListBGImage on correct input', function () {
            ContentSection.selectListBGImage();
            expect(ContentSection.section.data.itemListBGImage).toEqual('');
        })
    });

    describe('ContentSection.removeListBGImage', function () {


        it('it should pass if it gives blank value to the ListBGImage', function () {
            ContentSection.section.data.itemListBGImage = 'test';
            ContentSection.removeListBGImage();
            expect(ContentSection.section.data.itemListBGImage).toEqual('');
        })
    });

    describe('ContentSection.done', function () {

        var spy;
        beforeEach(inject(function () {
            spy = spyOn(Location, 'goToHome').and.callFake(function () {
            });

        }));

        it('it should pass if it calls Location goToHome', function () {
            ContentSection.done();
            expect(spy).toHaveBeenCalled();
        });
    });

    xdescribe('ContentSection.delete', function () {

        var spy;
        beforeEach(inject(function () {
            spy = spyOn(Location, 'goToHome').and.callFake(function () {
            });

        }));

        it('it should not delete the section if id is falsy', function () {
            var Sections = {
                delete: function () {
                    console.log('called testing');
                    var deferred = $q.defer();
                    deferred.resolve('Remote call result');
                    return deferred.promise;
                }
            };
            ContentSection.delete();
            expect(spy).toHaveBeenCalled();
        });
    });


});

