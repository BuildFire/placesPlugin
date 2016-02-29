describe('Unit : Controller - ContentSectionCtrl', function () {

// load the controller's module
    beforeEach(module('placesContent'));

    var $q, ContentSection, scope, $rootScope, $routeParams, DB, $timeout, COLLECTIONS, Orders, OrdersItems, AppConfig, Messaging, EVENTS, PATHS, $csv, Buildfire, Location;

    beforeEach(inject(function (_$q_, $controller, _$rootScope_, _DB_, _$timeout_, _COLLECTIONS_, _Orders_, _OrdersItems_, _AppConfig_, _Messaging_, _EVENTS_, _PATHS_, _$csv_, _Buildfire_, _Location_) {
            scope = _$rootScope_.$new();
            $rootScope = _$rootScope_;
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
                },
                navigation: {
                    scrollTop: function () {
                        console.log('scroll Top called');
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
                placesInfo: {
                    data: {
                        content: {
                            images: [],
                            descriptionHTML: '',
                            description: '<p>&nbsp;<br></p>',
                            sortBy: Orders.ordersMap.Newest,
                            rankOfLastItem: '',
                            sortByItems: OrdersItems.ordersMap.Newest
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
                        secSummary: '',
                        itemListBGImage: 'bgimage.png',
                        sortBy: '',
                        rankOfLastItem: ''
                    }
                },
                Buildfire: {
                    imageLib: {
                        showDialog: function (options, cb) {
                            cb(null, {selectedFiles: ['']});
                        }
                    }
                    ,
                    appearance: {
                        setHeaderVisibility: function () {

                        }
                    },
                    components: {
                        images: {
                            thumbnail: function (id) {
                                this.loadbackground = function (images) {
                                };
                                return this;
                            }
                        }
                    },
                    navigation: {
                        scrollTop: function () {
                            console.log('scroll Top called');
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

    describe('watcher of controller.section', function () {
        it('should change the lastSaved when PlaceInfo is changed succesfully on db', function () {
            ContentSection.masterSection = null;
            ContentSection._Sections.update = function () {
                var deferred = q.defer();
                deferred.resolve('Remote call result');
                return deferred.promise;
            };
            ContentSection.section.data.mainImage = 'mainImage.png';
            $rootScope.$digest();
            expect(ContentSection.masterSection).toBeNull();
        });

        it('should revert the PlaceInfo to lastSaved when db change failed', function () {
            ContentSection._Sections.update = function () {
                var deferred = q.defer();
                deferred.reject('Remote call result');
                return deferred.promise;
            };

            ContentSection.removeMainImage();
            $rootScope.$digest();
            expect(ContentSection.section.data.mainImage).toEqual('');
        });
    });


    describe('ContentSection.selectMainImage', function () {


        it('it should pass if it changes the selectMainImage on correct input', function () {
            ContentSection.selectMainImage();
            expect(ContentSection.section.data.itemListBGImage).toEqual('bgimage.png');
        });
        xit('it should pass if it changes the selectMainImage on Error case', function () {
            Buildfire.imageLib.showDialog = function (options, cb) {
                cb({Error: 'Error'}, null);
            };
            ContentSection.selectMainImage();
            expect(ContentSection.section.data.itemListBGImage).toEqual('bgimage.png');
        });
    });
});
describe('Unit : Controller - ContentSectionCtrl Undefined case', function () {

// load the controller's module
    beforeEach(module('placesContent'));

    var $q, ContentSection, scope, $rootScope, $routeParams, DB, $timeout, COLLECTIONS, Orders, OrdersItems, AppConfig, Messaging, EVENTS, PATHS, $csv, Buildfire, Location;

    beforeEach(inject(function (_$q_, $controller, _$rootScope_, _DB_, _$timeout_, _COLLECTIONS_, _Orders_, _OrdersItems_, _AppConfig_, _Messaging_, _EVENTS_, _PATHS_, _$csv_, _Buildfire_, _Location_) {
            scope = _$rootScope_.$new();
            $rootScope = _$rootScope_;
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
                },
                navigation: {
                    scrollTop: function () {
                        console.log('scroll Top called');
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
                            thumbnail: function (id) {
                                this.loadbackground = function (images) {
                                };
                                return this;
                            }
                        }
                    },
                    navigation: {
                        scrollTop: function () {
                            console.log('scroll Top called');
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
    });
});