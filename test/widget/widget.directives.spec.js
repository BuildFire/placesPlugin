xdescribe('Unit: buildFireCarousel Directive', function () {

    var $rootScope, $scope, $compile, el, simpleHtml = '<div id="carousel" build-fire-carousel="" ></divid>';


    beforeEach(function () {
        module('placesWidget');

        inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            //$scope.images = [];
            $compile = $injector.get('$compile');
            el = $compile(angular.element(simpleHtml))($scope);
        });

        $rootScope.$broadcast('Carousel:LOADED');
        $rootScope.$digest();

    });


    it('should Carousel:LOADED brodcasted', function () {

        expect($rootScope.$broadcast).toHaveBeenCalledWith('Carousel:LOADED');
    });

});


xdescribe('Unit: Google Map Directive', function () {

    var $rootScope, $scope, $compile, el, $body = $('body'), simpleHtml = '<div google-map location-data="[27,112]" marker-callback=""></div>';


    beforeEach(function () {
        module('placesWidget');

        inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            //$scope.images = [];
            $compile = $injector.get('$compile');
            el = $compile(angular.element(simpleHtml))($scope);
        });

        $body.append(el);
        $rootScope.$apply();

    });


    it('should contain have a default image', function () {
        expect(el.attr('src')).toBeTruthy();
    });

});
