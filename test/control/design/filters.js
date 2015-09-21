describe('Unit: resizeImage filter', function () {
    beforeEach(module('placesDesignFilters'));
    var filter;
    beforeEach(inject(function (_$filter_) {
        filter = _$filter_;
    }));

    it('it should pass if "resizeImage" filter returns resized image url', function () {
        var result;
        result = filter('resizeImage')('https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg', 88, 124, 'resize');
        expect(result).toEqual("http://s7obnu.cloudimage.io/s/resizenp/88x124/https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg");
    });

    it('it should give a default image even if parameter is blank', function () {
        var result;
        result = filter('resizeImage')('', 88, 124, 'resize');
        expect(result).toEqual("http://s7obnu.cloudimage.io/s/resizenp/88x124/");
    });
});