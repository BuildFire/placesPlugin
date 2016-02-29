describe("SettingsHomeCtrl", function () {

    var $rootScope,
        $scope,
        controller,
        q,
        DEFAULT_DATA;


    beforeEach(function () {
        module('placesSettings');

        inject(function ($injector, $q) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            controller = $injector.get('$controller')('SettingsHomeCtrl', {
                $scope: $scope,
                COLLECTIONS: $injector.get('COLLECTIONS'),
                DB: $injector.get('DB'),
                DEFAULT_DATA: {PLACES_INFO:{}},
                placesInfo: {
                    id: '1', data: {
                        content: {
                            images: [],
                            descriptionHTML: '',
                            description: '',
                            sortBy: 'Newest',
                            rankOfLastItem: ''
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
                $timeout: $injector.get('$timeout'),
                Buildfire: $injector.get('Buildfire')
            });
            q = $q;
        });
    });


    describe('Initialization', function () {
        it('should initialize the placeInfo', function () {
            expect(controller.placeInfo).toBeDefined();
        });

        xit('should initialize the _lastSaved', function () {
            expect(controller._lastSaved).toBeDefined();
        });
    });
    describe('watcher of controller.placeInfo', function () {

        it('should change the lastSaved when PlaceInfo is changed succesfully on db', function () {
            controller._lastSaved = null;
            controller._placeCenter.update = function () {
                var deferred = q.defer();
                deferred.resolve('Remote call result');
                return deferred.promise;
            };
            controller.placeInfo.data.settings.defaultView = 'list';
            $scope.$digest();
            expect(controller._lastSaved).toBeNull();
        });

        it('should revert the PlaceInfo to lastSaved when db change failed', function () {
            controller._placeCenter.update = function () {
                var deferred = q.defer();
                deferred.reject('Remote call result');
                return deferred.promise;
            };
            $scope.$digest();
            expect(controller.placeInfo.data.settings.defaultView).toEqual('list');
        });
    });
});