describe('Unit: placesDesignServices: Services', function () {
    beforeEach(module('placesDesignServices'));
    var Buildfire;


    describe('Unit : Buildfire service', function () {

        beforeEach(inject(
            function (_buildfire_) {
                Buildfire = _buildfire_;
            }));
    });

    describe('Unit : DataStore Factory', function () {
        var DataStore, Buildfire, STATUS_MESSAGES, STATUS_CODE, q;
        beforeEach(module('placesDesignServices'));
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
    describe('Unit : People service', function () {
        var DB, People, Buildfire, $rootScope;
        beforeEach(inject(
            function (_DB_, _$rootScope_, _Buildfire_) {
                DB = _DB_;
                Buildfire = _Buildfire_;
                People = new DB('People');
                $rootScope = _$rootScope_;
            }));
        beforeEach(inject(function () {
            Buildfire = {
                datastore: {}
            };
            Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['get', 'update', 'save']);
        }));

        it('People should exists', function () {
            expect(People).toBeDefined();
            expect(People._tagName).toEqual('People');
        });
        it('People methods should exists', function () {
            expect(People.get).toBeDefined();
            expect(People.save).toBeDefined();
            expect(People.update).toBeDefined();
        });
        it('People.get methods should call Buildfire.datastore.get', function () {
            Buildfire.datastore.get.and.callFake(function (tagName, cb) {
                cb(null, {});
            });
            People.get();
        });
        it('People.get methods should call Buildfire.datastore.get Error Case', function () {
            Buildfire.datastore.get.and.callFake(function (tagName, cb) {
                cb({code: 'No result found'}, null);
            });
            People.get();
        });
        describe('update method:', function () {
            it('People.update methods should call Buildfire.datastore.update', function () {
                Buildfire.datastore.update.and.callFake(function (tagName, cb) {
                    cb(null, {});
                });
                People.update('id', {});
                People.update();
                People.update('id');
            });
            it('People.update methods should call Buildfire.datastore.update Error Case', function () {
                Buildfire.datastore.update.and.callFake(function (id, data, tagName, cb) {
                    cb({}, null);
                });
                People.update('id', {});
                People.update();
                People.update('id');
            });
        });
        describe('save method:', function () {
            it('People.save methods should call Buildfire.datastore.save', function () {
                Buildfire.datastore.save.and.callFake(function (tagName, cb) {
                    cb(null, {});
                });
                People.save({});
                People.save();
            });
            it('People.save methods should call Buildfire.datastore.save Error case', function () {
                Buildfire.datastore.save.and.callFake(function (tagName, cb) {
                    cb({}, null);
                });
                People.save({});
                People.save();
            });
        });

    });
});