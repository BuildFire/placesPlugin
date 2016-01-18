describe('Unit: placesWidgetServices: Services', function () {
    beforeEach(module('placesWidgetServices'));
    var Buildfire;


    describe('Unit : Buildfire service', function () {

        beforeEach(inject(
            function (_buildfire_) {
                Buildfire = _buildfire_;
            }));
    });

    describe('Unit : DataStore Factory', function () {
        var DataStore, Buildfire, STATUS_MESSAGES, STATUS_CODE, q;
        beforeEach(module('placesWidgetServices'));
        Buildfire = {
            datastore: {}
        };
        Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['get', 'getById', 'bulkInsert', 'insert', 'search', 'update', 'save', 'delete']);
        beforeEach(inject(function (_DataStore_, _STATUS_CODE_, _STATUS_MESSAGES_) {
            DataStore = _DataStore_;
            STATUS_CODE = _STATUS_CODE_;
            STATUS_MESSAGES = _STATUS_MESSAGES_;
        }));
    });
    beforeEach(inject(function () {
        Buildfire = {
            datastore: {}
        };
        Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['get', 'update', 'save']);
    }));
    describe('Unit : Places service', function () {
        var DB, Places, Buildfire, $rootScope;
        beforeEach(inject(
            function (_DB_, _$rootScope_, _Buildfire_) {
                DB = _DB_;
                Buildfire = _Buildfire_;
                Places = new DB('Places');
                $rootScope = _$rootScope_;
            }));
        beforeEach(inject(function () {
            Buildfire = {
                datastore: {}
            };
            Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['get', 'getById', 'search']);
        }));

        it('Places should exists', function () {
            expect(Places).toBeDefined();
            expect(Places._tagName).toEqual('Places');
        });
        it('Places methods should exists', function () {
            expect(Places.get).toBeDefined();
        });
        it('Places.get methods should call Buildfire.datastore.get', function () {
            Buildfire.datastore.get.and.callFake(function (tagName, cb) {
                cb(null, {});
            });
            Places.get();
        });
        it('Places.get methods should call Buildfire.datastore.get Error Case', function () {
            Buildfire.datastore.get.and.callFake(function (tagName, cb) {
                cb({code: 'No result found'}, null);
            });
            Places.get();
        });
        describe('getById method:', function () {
            it('Places.getById methods should call Buildfire.datastore.getById', function () {
                Buildfire.datastore.getById.and.callFake(function (id, tagName, cb) {
                    cb(null, {data: {}});
                });
                Places.getById('id1');
            });
            it('Places.getById methods should call Buildfire.datastore.getById Error Case', function () {
                Buildfire.datastore.getById.and.callFake(function (id, tagName, cb) {
                    cb({}, null);
                });
                Places.getById('id1');
                Places.getById();
            });
        });
    });
});