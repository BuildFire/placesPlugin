describe('Unit : Controller - WidgetSectionsCtrl', function () {

// load the controller's module
    beforeEach(module('placesWidget'));

    var $q, WidgetSections, scope, $window, DB, COLLECTIONS, Buildfire, AppConfig, Messaging, EVENTS, PATHS, Location, Orders, DEFAULT_VIEWS, GeoDistance, $routeParams, $timeout, placesInfo, OrdersItems;
    var bf = {
        geo: {
            getCurrentPosition: jasmine.createSpy()
        },
        datastore: {
            onUpdate: function () {
            }
        }
    };

    beforeEach(inject(function (_$q_, $controller, _$rootScope_, _DB_, _COLLECTIONS_, _AppConfig_, _Messaging_, _EVENTS_, _PATHS_, _Location_, _Orders_, _DEFAULT_VIEWS_, _GeoDistance_, _$routeParams_, _$timeout_, _OrdersItems_) {
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
            DEFAULT_VIEWS = _DEFAULT_VIEWS_;
            GeoDistance = _GeoDistance_;
            WidgetSections = $controller('WidgetSectionsCtrl', {
                $scope: scope,
                $routeParams: {sectionId:'sectio1'},
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
                DEFAULT_VIEWS: DEFAULT_VIEWS,
                GeoDistance: {
                    getDistance: function (items,distanceIn) {
                        console.log('acv');
                        var deferred = $q.defer();
                        deferred.resolve(items);
                        return deferred.promise;
                    }
                },
                Buildfire: bf
            });
        })
    )
    ;

    describe('Units: units should be Defined', function () {
        it('it should pass if WidgetSections is defined', function () {
            expect(WidgetSections).not.toBeUndefined();
        });
    });

    describe('WidgetSections.sortFilter', function () {
        it('it should pass if WidgetSections.sortFilter returns true if WidgetSections.locationData.currentCoordinates is null', function () {
            WidgetSections.locationData.currentCoordinates = null;
            var res = WidgetSections.sortFilter({});
            expect(res).toBeTruthy();
        });

        it('it should pass if WidgetSections.sortFilter returns true if WidgetSections.locationData.currentCoordinates is null', function () {
            WidgetSections.locationData.currentCoordinates = [0, 0];
            scope.distanceSlider.min = 100;
            scope.distanceSlider.max = 200;
            var res = WidgetSections.sortFilter({data: {distanceText: '150 miles'}});
            expect(res).toBeTruthy();
        });

        it('WidgetSections.itemsOrder should pass if it returns distance when WidgetSections.sortOnClosest is true', function () {
            WidgetSections.sortOnClosest = true;
            var res = WidgetSections.itemsOrder({data: {distance: 1}});
            expect(res).toEqual(1);
        });

        it('WidgetSections.itemsOrder should pass if it returns distance when WidgetSections.sortOnClosest is true', function () {
            WidgetSections.placesInfo.data.content.sortByItems = 'Oldest';
            WidgetSections.sortOnClosest = false;
            var res = WidgetSections.itemsOrder({data: {dateCreated: 'test date'}});
            expect(res).toEqual('test date');
        });

        it('WidgetSections.sortFilter should pass if it returns true when distance is in slider range', function () {
            scope.distanceSlider.min = 1;
            scope.distanceSlider.max = 100;
            WidgetSections.filterUnapplied = false;
            WidgetSections.locationData.currentCoordinates = [30, 30];
            var item = {};
            item.data = {distanceText: '20 miles'};
            WidgetSections.sortOnClosest = false;
            var res = WidgetSections.sortFilter(item);
            expect(res).toBeTruthy();
        });


    });

    describe('Filter Categories - WidgetSections.resetSectionFilter', function () {
        it('should pass if it blanks WidgetSections.selectedSections when Items are being shown', function () {
            WidgetSections.selectedSections = ['test'];
            WidgetSections.showSections = false;
            WidgetSections.resetSectionFilter();
            expect(WidgetSections.selectedSections.length).toEqual(0);
        });

        it('should make WidgetSections.showSections true when WidgetSections.selectedSections is empty and WidgetSections.showSections is false', function () {
            WidgetSections.selectedSections = [];
            WidgetSections.showSections = false;
            WidgetSections.resetSectionFilter();
            expect(WidgetSections.showSections).toBeTruthy();
        });
    });

    describe('WidgetSections.toggleSectionSelection', function () {

        it('should pass if it sets WidgetSections.showSections to false', function () {
            WidgetSections.showSections = true;
            WidgetSections.sections = [{id: 1}];
            WidgetSections.toggleSectionSelection(0);
            expect(WidgetSections.showSections).toBeFalsy();
        });

        it('should pass if it adds to WidgetSections.selectedSections if the section was not selected', function () {
            WidgetSections.selectedSections = [];
            WidgetSections.sections = [{id: 1}];
            WidgetSections.toggleSectionSelection(0);
            expect(WidgetSections.selectedSections.length).toEqual(1);
        });

        it('should pass if it removes from WidgetSections.selectedSections if the section was selected', function () {
            WidgetSections.selectedSections = [1];
            WidgetSections.sections = [{id: 1}];
            WidgetSections.toggleSectionSelection(0);
            expect(WidgetSections.selectedSections.length).toEqual(0);
        });
    });

    describe('WidgetSections.selectedMarker', function () {

        var spy;
        beforeEach(inject(function () {
            spy = spyOn(GeoDistance, 'getDistance').and.callFake(function () {
                console.log('called');
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            });
        }));

        xit('should pass if it calls GeoDistance.getDistance', function () {
            WidgetSections.locationData.items = [{}];
            WidgetSections.selectedMarker(0);
            expect(spy).toHaveBeenCalled();
        });

        it('should pass if it nullifies WidgetSections.selectedItemDistance if the response from service is empty', function () {
            WidgetSections.locationData.items = [{}];
            WidgetSections.selectedMarker(0);
            expect(WidgetSections.selectedItemDistance).toBeNull();
        });


    });

    describe('WidgetSections.getSectionId', function () {

        it('should pass if it returns allitems when the passed array is empty', function () {
            var result = WidgetSections.getSectionId([]);
            expect(result).toEqual('allitems');
        });

        it('should pass if it returns first element when the passed array is not empty', function () {
            var result = WidgetSections.getSectionId([1, 2]);
            expect(result).toEqual('allitems');
        });


    });

    describe('WidgetSections.showDescription', function () {

        it('should pass if it returns true when description is not the default html', function () {
            WidgetSections.placesInfo.data.content.descriptionHTML = 'a';
            var result = WidgetSections.showDescription();
            expect(result).toEqual(true);
        });

        it('should pass if it returns true when description is not the default html', function () {
            WidgetSections.placesInfo.data.content.descriptionHTML = '<p>&nbsp;<br></p>';
            var result = WidgetSections.showDescription();
            expect(result).not.toEqual(true);
        });
    });


    describe('WidgetSections.loadMoreItems', function () {

        it('should pass if it does nothing when all items have been loaded', function () {
            WidgetSections.isBusyItems = false;
            WidgetSections.loadMoreItems();

        });
    });

    describe('WidgetSections.onSliderChange', function () {
        it('should pass if it returns true when description is not the default html', function () {
            WidgetSections.filterUnapplied = true;
            WidgetSections.onSliderChange();
            expect(WidgetSections.filterUnapplied).toEqual(false);
        });
    });

    describe('WidgetSections.selectedMarker', function () {
        /*
         var spy;
         beforeEach(inject(function () {
         spy = spyOn(GeoDistance, 'getDistance').and.callFake(function () {
         console.log('called');
         var deferred = $q.defer();
         deferred.resolve({rows: [{elements: [{distance: {text: 'test'}}]}]});
         return deferred.promise;
         });
         }));*/

        it('should pass if it nullifies WidgetSections.selectedItemDistance if the response from service is empty', function () {

            WidgetSections.locationData.items = [{}];
            WidgetSections.selectedMarker(0);
            console.log(WidgetSections.selectedItemDistance);
            expect(WidgetSections.selectedItemDistance).toEqual(null);
        });
    });


    describe('WidgetSections.loadMoreSections', function () {

        it('should pass if it does nothing if all sections have been loaded', function () {
            WidgetSections.noMoreSections = true;
            WidgetSections.loadMoreSections();
            expect(WidgetSections.noMoreSections).toEqual(true);
        });
        it('should pass if it calls', function () {
            WidgetSections.noMoreSections = false;
            WidgetSections.loadMoreSections();
            expect(WidgetSections.noMoreSections).toEqual(false);
        });
    });

    describe('WidgetSections.refreshLocation', function () {

        it('should pass if it calls ', function () {
            WidgetSections.refreshLocation();
            expect(bf.geo.getCurrentPosition).toHaveBeenCalled();
        });
    });

    describe('WidgetSections.openInMap', function () {

        window.open = jasmine.createSpy();

      /*  beforeEach(function () {
          spy = jasmine.createSpy(window,'open');
        });*/

        it('should pass if it calls with maps address in case of iphone ', function () {
            WidgetSections.selectedItem = {data:{address:{lat:1,lng:1}}};
            window.buildfire.context = {device:{platform : 'ios'}};
            WidgetSections.openInMap();
            expect(window.open).toHaveBeenCalledWith('maps://maps.google.com/maps?daddr=1,1');
        });

        it('should pass if it calls with http address in case of android ', function () {
            WidgetSections.selectedItem = {data:{address:{lat:1,lng:1}}};
            window.buildfire.context = {device:{platform : 'android'}};
            WidgetSections.openInMap();
            expect(window.open).toHaveBeenCalledWith('http://maps.google.com/maps?daddr=1,1');
        });
        it('should pass if it calls with http address in case of Zero ', function () {
            WidgetSections.deviceWidth = 0;
        });
    });

});
describe('Unit : Controller - WidgetSectionsCtrl Null Case', function () {

// load the controller's module
    beforeEach(module('placesWidget'));

    var $q, WidgetSections, scope, $window, DB, COLLECTIONS, Buildfire, AppConfig, Messaging, EVENTS, PATHS, Location, Orders, DEFAULT_VIEWS, GeoDistance, $routeParams, $timeout, placesInfo, OrdersItems;
    var bf = {
        geo: {
            getCurrentPosition: jasmine.createSpy()
        },
        datastore: {
            onUpdate: function () {
            }
        }
    };

    beforeEach(inject(function (_$q_, $controller, _$rootScope_, _DB_, _COLLECTIONS_, _AppConfig_, _Messaging_, _EVENTS_, _PATHS_, _Location_, _Orders_, _DEFAULT_VIEWS_, _GeoDistance_, _$routeParams_, _$timeout_, _OrdersItems_) {
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
            DEFAULT_VIEWS = _DEFAULT_VIEWS_;
            GeoDistance = _GeoDistance_;
            WidgetSections = $controller('WidgetSectionsCtrl', {
                $scope: scope,
                $routeParams: {sectionId:'allitems'},
                DB: DB,
                COLLECTIONS: COLLECTIONS,
                Orders: Orders,
                OrdersItems: OrdersItems,
                Messaging: Messaging,
                EVENTS: EVENTS,
                PATHS: PATHS,
                Location: Location,
                AppConfig: AppConfig,
                placesInfo: null,
                DEFAULT_VIEWS: DEFAULT_VIEWS,
                GeoDistance: {
                    getDistance: function () {
                        console.log('acv');
                        var deferred = $q.defer();
                        deferred.reject({rows: [{elements: [{distance: {text: 'test'}}]}]});
                        return deferred.promise;
                    }
                },
                Buildfire: bf
            });

        })
    )
    ;

    describe('Units: units should be Defined', function () {
        it('it should pass if WidgetSections is defined', function () {
            expect(WidgetSections).not.toBeUndefined();
        });
    });
});