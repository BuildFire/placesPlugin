


describe('Unit: Default Image Directive', function () {

    var $rootScope, $scope, $compile, el, $body = $('body'), simpleHtml = '<img ng-src="" default-image="" />';


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
