(function (angular, buildfire, location) {
    'use strict';
    //created placesSettingsServices module
    angular
        .module('placesSettingsServices', ['placesEnums'])
        .provider('Buildfire', [function () {
            this.$get = function () {
                return buildfire;
            };
        }])
        .factory('Location', [function () {
            var _location = location;
            return {
                go: function (path) {
                    _location.href = path;
                },
                goToHome: function () {
                    _location.href = _location.href.substr(0, _location.href.indexOf('#'));
                }
            };
        }])
        .factory('OrdersItems', [function () {
            var ordersMap = {
                Manually: "Manually",
                Default: "Newest",
                Newest: "Newest",
                Oldest: "Oldest",
                ItemAZ: "Item A-Z",
                ItemZA: "Item Z-A"
            };
            var orders = [
                {id: 1, name: "Manually", value: "Manually", key: "rank", order: 1},
                {id: 1, name: "Newest", value: "Newest", key: "dateCreated", order: -1},
                {id: 1, name: "Oldest", value: "Oldest", key: "dateCreated", order: 1},
                {id: 1, name: "ItemA-Z", value: "Item A-Z", key: "itemTitle", order: 1},
                {id: 1, name: "ItemZ-A", value: "Item Z-A", key: "itemTitle", order: -1}
            ];
            return {
                ordersMap: ordersMap,
                options: orders,
                getOrder: function (name) {
                    return orders.filter(function (order) {
                        return order.name === name;
                    })[0];
                }
            };
        }])
        .factory('Orders', [function () {
            var ordersMap = {
                Manually: "Manually",
                Default: "Manually",
                Newest: "Newest",
                Oldest: "Oldest",
                Most: " Oldest",
                Least: " Oldest"
            };
            var orders = [
                {id: 1, name: "Manually", value: "Manually", key: "rank", order: 1},
                {id: 1, name: "Newest", value: "Newest", key: "dateCreated", order: -1},
                {id: 1, name: "Oldest", value: "Oldest", key: "dateCreated", order: 1},
                {id: 1, name: "Most", value: "Most Items", key: "title", order: 1},
                {id: 1, name: "Least", value: "Least Items", key: "title", order: -1}
            ];
            return {
                ordersMap: ordersMap,
                options: orders,
                getOrder: function (name) {
                    return orders.filter(function (order) {
                        return order.name === name;
                    })[0];
                }
            };
        }])
        .factory("DB", ['Buildfire', '$q', 'MESSAGES', 'CODES', function (Buildfire, $q, MESSAGES, CODES) {
            function DB(tagName) {
                this._tagName = tagName;
            }

            DB.prototype.get = function () {
                var that = this;
                var deferred = $q.defer();
                Buildfire.datastore.get(that._tagName, function (err, result) {
                    if (err && err.code == CODES.NOT_FOUND) {
                        return deferred.resolve();
                    }
                    else if (err) {
                        return deferred.reject(err);
                    }
                    else {
                        return deferred.resolve(result);
                    }
                });
                return deferred.promise;
            };
            DB.prototype.update = function (id, item) {
                var that = this;
                var deferred = $q.defer();
                if (typeof id == 'undefined') {
                    return deferred.reject(new Error(MESSAGES.ERROR.ID_NOT_DEFINED));
                }
                if (typeof item == 'undefined') {
                    return deferred.reject(new Error(MESSAGES.ERROR.DATA_NOT_DEFINED));
                }
                Buildfire.datastore.update(id, item, that._tagName, function (err, result) {
                    if (err) {
                        return deferred.reject(err);
                    }
                    else if (result) {
                        return deferred.resolve(result);
                    } else {
                        return deferred.reject(new Error(MESSAGES.ERROR.NOT_FOUND));
                    }
                });
                return deferred.promise;
            };
            DB.prototype.save = function (item) {
                var that = this;
                var deferred = $q.defer();
                if (typeof item == 'undefined') {
                    return deferred.reject(new Error(MESSAGES.ERROR.DATA_NOT_DEFINED));
                }
                Buildfire.datastore.save(item, that._tagName, function (err, result) {
                    if (err) {
                        return deferred.reject(err);
                    }
                    else if (result) {
                        return deferred.resolve(result);
                    } else {
                        return deferred.reject(new Error(MESSAGES.ERROR.NOT_FOUND));
                    }
                });
                return deferred.promise;
            };
            return DB;
        }]);
})(window.angular, window.buildfire, window.location);