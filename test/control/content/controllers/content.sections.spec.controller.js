describe('Unit : Controller - ContentSectionsCtrl', function () {

// load the controller's module
    beforeEach(module('placesContent'));

    var $q, ContentSections, scope, DB, $timeout, COLLECTIONS, Orders, OrdersItems, AppConfig, Messaging, EVENTS, PATHS, $csv, Buildfire, Modals, placesInfo,Utils;

    beforeEach(inject(function (_$q_, $controller, _$rootScope_, _DB_, _$timeout_, _COLLECTIONS_, _Orders_, _OrdersItems_, _AppConfig_, _Messaging_, _EVENTS_, _PATHS_, _$csv_, _Buildfire_, _Modals_,_Utils_) {
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
            Modals = _Modals_;
            Buildfire = _Buildfire_;
            $q = _$q_;
            //Buildfire = _Buildfire_;
            //PlaceInfoData = _PlaceInfoData_;

            Utils = _Utils_;

            ContentSections = $controller('ContentSectionsCtrl', {
                $scope: scope,
                placesInfo: {id: '1', data: {content: {sortBy: 'title'}}},
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
                Modals: Modals,
                Buildfire: {
                    imageLib: {
                        showDialog: function () {
                            return (null, {selectedFiles: ['']});
                        }
                    }
                    ,
                    appearance: {
                        setHeaderVisibility: function () {

                        }
                    },
                    components: {
                        images: {
                            thumbnail: function () {
                            }
                        },
                        carousel: {
                            editor: function () {
                                var a = {loadItems:function(){}};
                                return a;
                            }
                        }
                    }
                },
                Utils:_Utils_,
                DEFAULT_DATA : {}
            });
        })
    )
    ;

    describe('Units: units should be Defined', function () {
        it('it should pass if ContentSections is defined', function () {
            expect(ContentSections).not.toBeUndefined();
        });
        it('it should pass if Modals is defined', function () {
            expect(Modals).not.toBeUndefined();
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
        it('it should pass if ContentHome.info function is defined', function () {
            expect(ContentSections.info).not.toBeUndefined();
        });
        it('it should pass if ContentHome.bodyWYSIWYGOptions is defined', function () {
            expect(ContentSections.bodyWYSIWYGOptions).not.toBeUndefined();
        });
        it('it should pass if ContentHome.itemSortableOptions is defined', function () {
            expect(ContentSections.itemSortableOptions).not.toBeUndefined();
        });
    });

    describe('Bulk Upload', function () {
        var spy, importSpy;
        beforeEach(inject(function () {
            spy = spyOn($csv, 'download').and.callFake(function () {
            });
            importSpy = spyOn($csv, 'import').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(null);
                return deferred.promise;
            });
        }));
        it('ContentSections.getTemplate should be defined', function () {
            expect(ContentSections.getTemplate).toBeDefined();
        });
        it('ContentSections.getTemplate should pass if it calls $csv download', function () {
            ContentSections.getTemplate();
            expect(spy).toHaveBeenCalled();
        });
        it('ContentSections.exportCSV should be defined', function () {
            expect(ContentSections.exportCSV).toBeDefined();
        });

        it('ContentSections.openImportCSVDialog should make ContentSections.csvDataInvalid true in import error callback', function () {
            ContentSections.openImportCSVDialog();
            expect(ContentSections.csvDataInvalid).toBeUndefined();
        });

    });


    describe('Search Sections Module', function () {
        var spy;
        beforeEach(inject(function () {
            spy = spyOn(ContentSections, 'getMore').and.callFake(function () {
            });

        }));
        it('ContentSections.searchListSection should be defined', function () {
            expect(ContentSections.searchListSection).toBeDefined();
        });

        it('ContentSections.searchListSection should pass if it calls getMore', function () {
            ContentSections.searchListSection('test');
            expect(spy).toHaveBeenCalled();
        });

    });

    describe('Sort Sections Module', function () {
        var spy;
        beforeEach(inject(function () {
            spy = spyOn(ContentSections, 'getMore').and.callFake(function () {
            });

        }));
        it('ContentSections.toggleSortOrder should be defined', function () {
            expect(ContentSections.toggleSortOrder).toBeDefined();
        });

        it('ContentSections.toggleSortOrder should pass if it calls getMore if parameter name is passed correctly', function () {
            ContentSections.toggleSortOrder('Manually');
            expect(spy).toHaveBeenCalled();
        });

        it('ContentSections.toggleSortOrder should pass if it doesnt call getMore if parameter name is not passed correctly', function () {
            ContentSections.toggleSortOrder(null);
            expect(spy).not.toHaveBeenCalled();
        });

    });

    describe('Delete Sections Module', function () {
        var spy;
        beforeEach(inject(function () {
            spy = spyOn(Modals, 'removePopupModal').and.callFake(function () {
                console.log('called');
                var deferred = $q.defer();
                deferred.resolve(['Remote call result']);
                return deferred.promise;
            });

        }));
        it('ContentSections.removeListSection should be defined', function () {
            expect(ContentSections.removeListSection).toBeDefined();
        });

        it('ContentSections.removeListSection should not do anything if parameter is undefined', function () {
            ContentSections.removeListSection();
            expect(spy).not.toHaveBeenCalled();
        });

        it('ContentSections.removeListSection should call popup function if parameter is correct', function () {
            ContentSections.sections = [{}];
            ContentSections.removeListSection(0);
            expect(spy).toHaveBeenCalled();
        });

    });

    describe('Carousel', function () {
        it('ContentSections.editor.onAddItems should pass if it initialises the ContentSections.info.data.content.images to blank array if it doesnt exyst', function () {
            ContentSections.info.data.content.images = null;
            ContentSections.editor.onAddItems(['test']);
            expect(ContentSections.info.data.content.images.length).toEqual(1);
        });

        it('ContentSections.editor.onDeleteItem should pass if it deletes the item at given index', function () {
            ContentSections.info.data.content.images = ['test'];
            ContentSections.editor.onDeleteItem({}, 0);
            expect(ContentSections.info.data.content.images.length).toEqual(0);
        });

        it('ContentSections.editor.onItemChange should call popup function if parameter is correct', function () {
            ContentSections.info.data.content.images = ['and'];
            ContentSections.editor.onItemChange('test', 0);
            expect(ContentSections.info.data.content.images[0]).toEqual('test');
        });

        it('ContentSections.editor.onOrderChange should pass if it changes the index of given item', function () {
            ContentSections.info.data.content.images = ['and', 'test', 'if'];
            ContentSections.editor.onOrderChange('test', 1, 2);
            expect(ContentSections.info.data.content.images[2]).toEqual('test');
        });
    });

    describe('Infinite scroll', function () {

        it('should make isBusy true when data is not being fetched', function () {
            ContentSections.isBusy = false;
            ContentSections.getMore();
            expect(ContentSections.isBusy).toBeTruthy();
        });

        it('should do nothing when all data is fetched i.e. noMore is true', function () {
            ContentSections.isBusy = false;
            ContentSections.noMore = true;
            ContentSections.getMore();
            expect(ContentSections.isBusy).toBeFalsy();
        });


    });
});


xdescribe('Unit : Controller - ContentSectionsCtrl - First time plugin setup - No placeInfo data', function () {

// load the controller's module
    beforeEach(module('placesContent'));

    var $q, ContentSections, scope, DB, $timeout, COLLECTIONS, Orders, OrdersItems, AppConfig, Messaging, EVENTS, PATHS, $csv, Buildfire, Modals, placesInfo;

    beforeEach(inject(function (_$q_, $controller, _$rootScope_,_Buildfire_, _DB_, _$timeout_, _COLLECTIONS_, _Orders_, _OrdersItems_, _AppConfig_, _Messaging_, _EVENTS_, _PATHS_, _$csv_, _Modals_) {
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
            Modals = _Modals_;
            Buildfire = _Buildfire_;
            $q = _$q_;
            //Buildfire = _Buildfire_;
            //PlaceInfoData = _PlaceInfoData_;

            ContentSections = $controller('ContentSectionsCtrl', {
                $scope: scope,
                placesInfo: null,
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
                Modals: Modals,
                Buildfire: Buildfire
            });
        })
    )
    ;


    describe('PlaceInfo Resolve', function () {

        beforeEach(inject(function () {
            ContentSections.placesInfo = null;

        }));
        it('ContentSections.info.data.content.rankOfLastItem should be undefined', function () {
            console.log(ContentSections.info.data.content);
            expect(ContentSections.info.data.content.rankOfLastItem).toEqual('');
        });

    });

});