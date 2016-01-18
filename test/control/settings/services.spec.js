describe('Unit: placesSettingsServices: Services', function () {
    beforeEach(module('placesSettingsServices'));
    var Buildfire;


    describe('Unit : Buildfire service', function () {

        beforeEach(inject(
            function (_buildfire_) {
                Buildfire = _buildfire_;
            }));
    });

    describe('Unit : DataStore Factory', function () {
        var DataStore, Buildfire, STATUS_MESSAGES, STATUS_CODE, q;
        beforeEach(module('placesSettingsServices'));
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
            Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['get', 'update', 'save']);
        }));

        it('Places should exists', function () {
            expect(Places).toBeDefined();
            expect(Places._tagName).toEqual('Places');
        });
        it('Places methods should exists', function () {
            expect(Places.get).toBeDefined();
            expect(Places.save).toBeDefined();
            expect(Places.update).toBeDefined();
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
        describe('update method:', function () {
            it('Places.update methods should call Buildfire.datastore.update', function () {
                Buildfire.datastore.update.and.callFake(function (tagName, cb) {
                    cb(null, {});
                });
                Places.update('id', {});
                Places.update();
                Places.update('id');
            });
            it('Places.update methods should call Buildfire.datastore.update Error Case', function () {
                Buildfire.datastore.update.and.callFake(function (id, data, tagName, cb) {
                    cb({}, null);
                });
                Places.update('id', {});
                Places.update();
                Places.update('id');
            });
        });
        describe('save method:', function () {
            it('Places.save methods should call Buildfire.datastore.save', function () {
                Buildfire.datastore.save.and.callFake(function (tagName, cb) {
                    cb(null, {});
                });
                Places.save({});
                Places.save();
            });
            it('Places.save methods should call Buildfire.datastore.save Error case', function () {
                Buildfire.datastore.save.and.callFake(function (tagName, cb) {
                    cb({}, null);
                });
                Places.save({});
                Places.save();
            });
        });

    });
});