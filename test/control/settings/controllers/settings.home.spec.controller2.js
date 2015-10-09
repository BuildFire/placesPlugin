describe("SettingsHomeCtrl", function () {

    var $rootScope,
        $scope,
        controller,
        q;


    beforeEach(function () {
        module('placesSettings');

        inject(function ($injector, $q) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            controller = $injector.get('$controller')('SettingsHomeCtrl', {
                $scope: $scope,
                COLLECTIONS: $injector.get('COLLECTIONS'),
                DB: $injector.get('DB'),
                placesInfo:null,
                $timeout: $injector.get('$timeout'),
                Buildfire: $injector.get('Buildfire')
            });
            q = $q;
        });
    });


    describe('Initialization', function () {
        it('should initialize the placeInfo when placesInfo is null', function () {
            expect(controller.placeInfo).toBeDefined();
        });

        it('should initialize the _lastSaved  when placesInfo is null', function () {
            expect(controller._lastSaved).toBeDefined();
        });
    });
});