describe('Unit : Controller - WidgetSectionsCtrl', function () {

// load the controller's module
    beforeEach(module('placesWidget'));

    var $q, WidgetSections, scope, $window, DB, COLLECTIONS, Buildfire, AppConfig, Messaging, EVENTS, PATHS, Location, Orders, DEFAULT_VIEWS, GeoDistance, $routeParams, $timeout, placesInfo, OrdersItems;

    beforeEach(inject(function (_$q_, _$routeParams_, $controller, _$rootScope_, _DB_, _COLLECTIONS_, _AppConfig_, _Messaging_, _EVENTS_, _PATHS_, _Location_, _Orders_, _DEFAULT_VIEWS_, _GeoDistance_, _$routeParams_, _$timeout_, _OrdersItems_) {
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
                placesInfo: {data:{design:{},settings:{showDistanceIn : true},content:{sortBy:'Newest'}}},
                DEFAULT_VIEWS: DEFAULT_VIEWS,
                GeoDistance : GeoDistance
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
            WidgetSections.locationData.currentCoordinates = [0,0];
            scope.distanceSlider.min = 100;
            scope.distanceSlider.max = 200;
            var res = WidgetSections.sortFilter({data:{distanceText:'150 miles'}});
            expect(res).toBeTruthy();
        });

        it('WidgetSections.itemsOrder should pass if it returns distance when WidgetSections.sortOnClosest is true', function () {
            WidgetSections.sortOnClosest = true;
            var res = WidgetSections.itemsOrder({data:{distance:1}});
            expect(res).toEqual(1);
        });

        it('WidgetSections.itemsOrder should pass if it returns distance when WidgetSections.sortOnClosest is true', function () {
            WidgetSections.placesInfo.data.content.sortByItems = 'Oldest';
            WidgetSections.sortOnClosest = false;
            var res = WidgetSections.itemsOrder({data:{dateCreated:'test date'}});
            expect(res).toEqual('test date');
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
            WidgetSections.sections = [{id:1}];
            WidgetSections.toggleSectionSelection(0);
            expect(WidgetSections.showSections).toBeFalsy();
        });

        it('should pass if it adds to WidgetSections.selectedSections if the section was not selected', function () {
            WidgetSections.selectedSections = [];
            WidgetSections.sections = [{id:1}];
            WidgetSections.toggleSectionSelection(0);
            expect(WidgetSections.selectedSections.length).toEqual(1);
        });

        it('should pass if it removes from WidgetSections.selectedSections if the section was selected', function () {
            WidgetSections.selectedSections = [1];
            WidgetSections.sections = [{id:1}];
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

        it('should pass if it calls GeoDistance.getDistance', function () {
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

    //xdescribe('WidgetSections.selectedMarker', function () {
    //
    //    var spy;
    //    beforeEach(inject(function () {
    //        spy = spyOn(GeoDistance, 'getDistance').and.callFake(function () {
    //            console.log('called');
    //            var deferred = $q.defer();
    //            deferred.resolve({rows: [{elements: [{distance: {text: 'test'}}]}]});
    //            return deferred.promise;
    //        });
    //    }));
    //
    //    it('should pass if it nullifies WidgetSections.selectedItemDistance if the response from service is empty', function () {
    //
    //        WidgetSections.locationData.items = [{}];
    //        WidgetSections.selectedMarker(0);
    //        console.log(WidgetSections.selectedItemDistance);
    //        expect(WidgetSections.selectedItemDistance).toEqual('test');
    //    });
    //});


//    xdescribe('WidgetSections.loadMoreSections', function () {
//
//       /* var spy;
//        beforeEach(inject(function () {
//            spy = spyOn(GeoDistance, 'getDistance').and.callFake(function () {
//                console.log('called');
//                var deferred = $q.defer();
//                deferred.resolve({rows: [{elements: [{distance: {text: 'test'}}]}]});
//                return deferred.promise;
//            });
//        }));
//*/
//        it('should pass if it nullifies WidgetSections.selectedItemDistance if the response from service is empty', function () {
//
//            WidgetSections.locationData.items = [{}];
//            WidgetSections.selectedMarker(0);
//            console.log(WidgetSections.selectedItemDistance);
//            expect(WidgetSections.selectedItemDistance).toEqual('test');
//        });
//    });


});