describe("DesignHomeCtrl :::placesInfo =null", function () {

    var $rootScope,
        $scope,
        controller,
        q;


    beforeEach(function () {
        module('placesDesign');

        inject(function ($injector, $q) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            controller = $injector.get('$controller')('DesignHomeCtrl', {
                $scope: $scope,
                Orders: $injector.get('Orders'),
                COLLECTIONS: $injector.get('COLLECTIONS'),
                DB: $injector.get('DB'),
                placesInfo:null,
                $timeout: $injector.get('$timeout'),
                Buildfire: {
                    imageLib: {
                        showDialog: function (options, callback) {
                            controller._callback(null, {selectedFiles: ['test']});
                        }
                    }
                }
            });
            q = $q;
        });
    });

    describe('DesignHome.placeInfo', function () {
        it('DesignHome.placeInfo should be defined', function () {
            expect(controller.placeInfo).toBeDefined();
        });
    });
});