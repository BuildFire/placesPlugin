describe('Unit : Controller - ContentItemsCtrl', function () {

// load the controller's module
    beforeEach(module('placesContent'));

    var $q, ContentItems, scope, $routeParams, $rootScope, Buildfire, DB, COLLECTIONS, Modals, Orders, OrdersItems, Messaging, EVENTS, PATHS, Location, placesInfo;

    beforeEach(inject(function (_$q_, _$routeParams_, $controller, _Buildfire_, _$rootScope_, _DB_, _COLLECTIONS_, _Modals_, _Orders_, _OrdersItems_, _Messaging_, _EVENTS_, _PATHS_, _Location_) {
            scope = _$rootScope_.$new();
            $rootScope = _$rootScope_;
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
            Buildfire = _Buildfire_;
            //placesInfo = {data: {content: {}}};
            $routeParams = _$routeParams_;

            ContentItems = $controller('ContentItemsCtrl', {
                $scope: scope,
                $routeParams: $routeParams,
                DB: DB,
                COLLECTIONS: COLLECTIONS,
                Orders: Orders,
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
                                var a = {
                                    loadItems: function () {
                                    }
                                };
                                return a;
                            }
                        }
                    }
                },
                OrdersItems: OrdersItems,
                Messaging: Messaging,
                EVENTS: EVENTS,
                PATHS: PATHS,
                Location: Location,
                Modals: Modals,
                placesInfo: {
                    data: {
                        content: {
                            images: [],
                            descriptionHTML: '<p>&nbsp;<br></p>',
                            description: '<p>&nbsp;<br></p>',
                            sortBy: 'Newest',
                            rankOfLastItem: '',
                            sortByItems: 'Newest'
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
                        secSummary: "This will be summary",
                        itemListBGImage: '',
                        sortBy: '',
                        rankOfLastItem: ''
                    },
                    id: '12312412'
                }
            });
        })
    )
    ;

    describe('Units: units should be Defined', function () {
        it('it should pass if ContentItems is defined', function () {
            expect(ContentItems).not.toBeUndefined();
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

        it('it should pass if Messaging function is defined', function () {
            expect(Messaging).not.toBeUndefined();
        });
        it('it should pass if EVENTS function is defined', function () {
            expect(EVENTS).not.toBeUndefined();
        });
        it('it should pass if PATHS function is defined', function () {
            expect(PATHS).not.toBeUndefined();
        });
        it('it should pass if ContentItems.info is defined', function () {
            expect(ContentItems.info).not.toBeUndefined();
        });
        it('it should pass if ContentItems.itemSortableOptions is defined', function () {
            expect(ContentItems.itemSortableOptions).not.toBeUndefined();
        });
    });
    describe('Function : ContentItems.toggleSortOrder ', function () {
        it('ContentItems.toggleSortOrder should be called', function () {
            ContentItems.toggleSortOrder('Newest');
        });
    });
    describe('Function : ContentItems.deepLinkUrl ', function () {
        it('ContentItems.deepLinkUrl should be called', function () {
            ContentItems.deepLinkUrl('url1');
        });
    });
    describe('Function : ContentItems.removeListItem ', function () {
        it('ContentItems.removeListItem should be called', function () {
            ContentItems.items = [{}];
            ContentItems.removeListItem(1);
        });
    });
    describe('Function : ContentItems.removeListItem undefined case ', function () {
        it('ContentItems.removeListItem should be called', function () {
            ContentItems.items = [{}];
            ContentItems.removeListItem();
        });
    });
    describe('Function : ContentItems.searchListItem  ', function () {
        it('ContentItems.searchListItem should be called', function () {
            ContentItems.searchListItem('Value ');
        });
    });
    describe('Function : ContentItems.searchListItem blank case ', function () {
        it('ContentItems.searchListItem should be called', function () {
            ContentItems.searchListItem(' ');
        });
    });

    xdescribe('ContentItems.editSections', function () {
        var Sections;
        beforeEach(inject(function () {
            spy = spyOn(window.Sections, 'find').and.callFake(function () {
                console.log(786);
                var deferred = $q.defer();
                deferred.resolve('Remote call result');
                return deferred.promise;
            });

            Sections = jasmine.createSpy().and.callFake(function () {
                console.log(786);
                var deferred = $q.defer();
                deferred.resolve('Remote call result');
                return deferred.promise;
            });
        }));
        it('it should pass if ContentItems.editSections calls Items.update', function () {
            ContentItems.editSections();
            expect(Sections).toHaveBeenCalled();
        });
    });
    xdescribe('ContentItems.toggleSortOrder', function () {
        it('it should pass if ContentItems.toggleSortOrder calls', function () {
            ContentItems.toggleSortOrder('Newest');
            $rootScope.$digest();
            expect(ContentItems.info.data.content.sortByItems).toEqual('Newest');
        });
    });
    describe('Function called ContentItems.itemSortableOptions.stop when next and pre available', function () {
        it('it should pass if ContentItems.itemSortableOptions.stop calls has been called', function () {
            var ui = {
                item: {
                    sortable: {
                        dropindex: 1
                    }
                }
            };
            ContentItems.items = [{
                data: {
                    listImage: '',
                    itemTitle: '',
                    images: [],
                    summary: '',
                    bodyContent: '',
                    bodyContentHTML: '',
                    addressTitle: '',
                    sections: ['123124234'],
                    address: {
                        lat: '28',
                        lng: '77',
                        aName: 'Office'
                    },
                    links: [],
                    backgroundImage: '',
                    rank: 20
                }
            }, {
                data: {
                    listImage: '',
                    itemTitle: '',
                    images: [],
                    summary: '',
                    bodyContent: '',
                    bodyContentHTML: '',
                    addressTitle: '',
                    sections: ['123124234'],
                    address: {
                        lat: '28',
                        lng: '77',
                        aName: 'Office'
                    },
                    links: [],
                    backgroundImage: '',
                    rank: 30
                }
            }, {
                data: {
                    listImage: '',
                    itemTitle: '',
                    images: [],
                    summary: '',
                    bodyContent: '',
                    bodyContentHTML: '',
                    addressTitle: '',
                    sections: ['123124234'],
                    address: {
                        lat: '28',
                        lng: '77',
                        aName: 'Office'
                    },
                    links: [],
                    backgroundImage: '',
                    rank: 40
                }
            }];
            ContentItems.Items = {
                update: function (id, data) {
                    var deferred = $q.defer();
                    deferred.resolve({id: id, data: data});
                    return deferred.promise;
                }
            };
            ContentItems.itemSortableOptions.stop({}, ui);
            //expect(ContentItems.itemSortableOptions.stop).toHaveBeenCalled();
        });
    });
    describe('Function called ContentItems.itemSortableOptions.stop when pre available', function () {
        it('it should pass if ContentItems.itemSortableOptions.stop calls has been called', function () {
            var ui = {
                item: {
                    sortable: {
                        dropindex: 1
                    }
                }
            };
            ContentItems.items = [{
                data: {
                    listImage: '',
                    itemTitle: '',
                    images: [],
                    summary: '',
                    bodyContent: '',
                    bodyContentHTML: '',
                    addressTitle: '',
                    sections: ['123124234'],
                    address: {
                        lat: '28',
                        lng: '77',
                        aName: 'Office'
                    },
                    links: [],
                    backgroundImage: '',
                    rank: 20
                }
            }, {
                data: {
                    listImage: '',
                    itemTitle: '',
                    images: [],
                    summary: '',
                    bodyContent: '',
                    bodyContentHTML: '',
                    addressTitle: '',
                    sections: ['123124234'],
                    address: {
                        lat: '28',
                        lng: '77',
                        aName: 'Office'
                    },
                    links: [],
                    backgroundImage: '',
                    rank: 30
                }
            }];
            ContentItems.Items = {
                update: function (id, data) {
                    var deferred = $q.defer();
                    deferred.resolve({id: id, data: data});
                    return deferred.promise;
                }
            };
            ContentItems.itemSortableOptions.stop({}, ui);
            //expect(ContentItems.itemSortableOptions.stop).toHaveBeenCalled();
        });
    });
    describe('Function called ContentItems.itemSortableOptions.stop when next available', function () {
        it('it should pass if ContentItems.itemSortableOptions.stop calls has been called', function () {
            var ui = {
                item: {
                    sortable: {
                        dropindex: 0
                    }
                }
            };
            ContentItems.items = [{
                data: {
                    listImage: '',
                    itemTitle: '',
                    images: [],
                    summary: '',
                    bodyContent: '',
                    bodyContentHTML: '',
                    addressTitle: '',
                    sections: ['123124234'],
                    address: {
                        lat: '28',
                        lng: '77',
                        aName: 'Office'
                    },
                    links: [],
                    backgroundImage: '',
                    rank: 20
                }
            }, {
                data: {
                    listImage: '',
                    itemTitle: '',
                    images: [],
                    summary: '',
                    bodyContent: '',
                    bodyContentHTML: '',
                    addressTitle: '',
                    sections: ['123124234'],
                    address: {
                        lat: '28',
                        lng: '77',
                        aName: 'Office'
                    },
                    links: [],
                    backgroundImage: '',
                    rank: 30
                }
            }];
            ContentItems.Items = {
                update: function (id, data) {
                    var deferred = $q.defer();
                    deferred.resolve({id: id, data: data});
                    return deferred.promise;
                }
            };
            ContentItems.itemSortableOptions.stop({}, ui);
            //expect(ContentItems.itemSortableOptions.stop).toHaveBeenCalled();
        });
    });
});
describe('Unit : Controller - ContentItemsCtrl Undefined values case', function () {

// load the controller's module
    beforeEach(module('placesContent'));

    var $q, ContentItems, scope, $routeParams, $rootScope, Buildfire, DB, COLLECTIONS, Modals, Orders, OrdersItems, Messaging, EVENTS, PATHS, Location, placesInfo;

    beforeEach(inject(function (_$q_, _$routeParams_, $controller, _Buildfire_, _$rootScope_, _DB_, _COLLECTIONS_, _Modals_, _Orders_, _OrdersItems_, _Messaging_, _EVENTS_, _PATHS_, _Location_) {
            scope = _$rootScope_.$new();
            $rootScope = _$rootScope_;
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
            Buildfire = _Buildfire_;
            //placesInfo = {data: {content: {}}};
            $routeParams = _$routeParams_;

            ContentItems = $controller('ContentItemsCtrl', {
                $scope: scope,
                $routeParams: {sectionId: 'section1'},
                DB: DB,
                COLLECTIONS: COLLECTIONS,
                Orders: Orders,
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
                                var a = {
                                    loadItems: function () {
                                    }
                                };
                                return a;
                            }
                        }
                    },
                    navigation: {
                        scrollTop: function () {
                            console.log('scroll Top called');
                        }
                    }
                },
                OrdersItems: OrdersItems,
                Messaging: Messaging,
                EVENTS: EVENTS,
                PATHS: PATHS,
                Location: Location,
                Modals: Modals,
                placesInfo: null,
                sectionInfo: null
            });
        })
    )
    ;

    describe('Units: units should be Defined', function () {
        it('it should pass if ContentItems is defined', function () {
            expect(ContentItems).not.toBeUndefined();
        });
    });
});

