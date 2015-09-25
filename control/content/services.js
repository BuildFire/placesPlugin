(function (angular, buildfire, location) {
    'use strict';
    //created mediaCenterWidget module
    var settings, appId;
    var Settings = {
        setSettings: function (newSettings) {
            settings = newSettings;
        },
        setAppId: function (newId) {
            appId = newId;
        },
        getSetting: function () {
            return settings;
        },
        getAppId: function () {
            return appId;
        }
    };
    angular
        .module('placesServices', ['placesContentEnums'])
        .provider('Buildfire', [function () {
            this.$get = function () {
                return buildfire;
            };
        }])
        .provider('Messaging', [function () {
            this.$get = function () {
                return buildfire.messaging;
            };
        }])
        .provider('ImageLib', [function () {
            this.$get = function () {
                return buildfire.imageLib;
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
                Default: "Manually",
                Newest: "Newest",
                Oldest: "Oldest",
                SectionAZ: "Section A-Z",
                SectionZA: "Section Z-A"
            };
            var orders = [
                {id: 1, name: "Manually", value: "Manually", key: "rank", order: 1},
                {id: 1, name: "Newest", value: "Newest", key: "dateCreated", order: -1},
                {id: 1, name: "Oldest", value: "Oldest", key: "dateCreated", order: 1},
                {id: 1, name: "SectionA-Z", value: "Section A-Z", key: "title", order: 1},
                {id: 1, name: "SectionZ-A", value: "Section Z-A", key: "title", order: -1}
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
                SectionAZ: "Section Name A-Z",
                SectionZA: "Section Name Z-A"
            };
            var orders = [
                {id: 1, name: "Manually", value: "Manually", key: "rank", order: 1},
                {id: 1, name: "Newest", value: "Newest", key: "dateCreated", order: -1},
                {id: 1, name: "Oldest", value: "Oldest", key: "dateCreated", order: 1},
                {id: 1, name: "Section Name A-Z", value: "Section Name A-Z", key: "secTitle", order: 1},
                {id: 1, name: "Section Name Z-A", value: "Section Name Z-A", key: "secTitle", order: -1}
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
            DB.prototype.getById = function (id) {
                var that = this;
                var deferred = $q.defer();
                Buildfire.datastore.getById(id, that._tagName, function (err, result) {
                    if (err) {
                        return deferred.reject(err);
                    }
                    else if (result && result.data) {
                        return deferred.resolve(result);
                    } else {
                        return deferred.reject(new Error(MESSAGES.ERROR.NOT_FOUND));
                    }
                });
                return deferred.promise;
            };
            DB.prototype.insert = function (items) {
                var that = this;
                var deferred = $q.defer();
                if (typeof items == 'undefined') {
                    return deferred.reject(new Error(MESSAGES.ERROR.DATA_NOT_DEFINED));
                }
                if (Array.isArray(items)) {
                    Buildfire.datastore.bulkInsert(items, that._tagName, function (err, result) {
                        if (err) {
                            return deferred.reject(err);
                        }
                        else if (result) {
                            return deferred.resolve(result);
                        } else {
                            return deferred.reject(new Error(MESSAGES.ERROR.NOT_FOUND));
                        }
                    });
                } else {
                    Buildfire.datastore.insert(items, that._tagName, false, function (err, result) {
                        if (err) {
                            return deferred.reject(err);
                        }
                        else if (result) {
                            return deferred.resolve(result);
                        } else {
                            return deferred.reject(new Error(MESSAGES.ERROR.NOT_FOUND));
                        }
                    });
                }
                return deferred.promise;
            };
            DB.prototype.find = function (options) {
                var that = this;
                var deferred = $q.defer();
                if (typeof options == 'undefined') {
                    return deferred.reject(new Error(MESSAGES.ERROR.OPTION_REQUIRES));
                }
                Buildfire.datastore.search(options, that._tagName, function (err, result) {
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
            DB.prototype.delete = function (id) {
                var that = this;
                var deferred = $q.defer();
                if (typeof id == 'undefined') {
                    return deferred.reject(new Error(MESSAGES.ERROR.ID_NOT_DEFINED));
                }
                Buildfire.datastore.delete(id, that._tagName, function (err, result) {
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
        }])
        .value('Settings', Settings)
        .factory("AppConfig", ['$rootScope', 'Buildfire', 'Settings', function ($rootScope, Buildfire, Settings) {
            return {
                setSettings: function (newSettings) {
                    Settings.setSettings(newSettings);
                },
                setAppId: function (newAppId) {
                    Settings.setAppId(newAppId);
                },
                getSettings: function () {
                    return Settings.getSetting();
                },
                getAppId: function () {
                    return Settings.getAppId();
                },
                changeBackgroundTheme: function (url) {
                    if (url) {
                        $rootScope.currentBackgroundImage = {
                            "background-image": "url(" + Buildfire.imageLib.resizeImage(url, {
                                width: 342,
                                height: 770
                            }) + ")"
                        };
                    } else {
                        $rootScope.currentBackgroundImage = "";
                    }
                }
            };
        }])
        .factory("Utils", ['$http', 'GOOGLE_KEYS', '$q', function ($http, GOOGLE_KEYS, $q) {
            function inRange(min, number, max) {
                return ( !isNaN(number) && (number >= min) && (number <= max) );
            }

            return {
                validLongLats: function (longLats) {
                    var deferred = $q.defer()
                        , longitude = longLats.split(",")[0]
                        , latitude = longLats.split(",")[1]
                        , valid = (inRange(-90, latitude, 90) && inRange(-180, longitude, 180));

                    if (valid) {
                        $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=" + GOOGLE_KEYS.API_KEY)
                            .then(function (response) {
                                // this callback will be called asynchronously
                                // when the response is available
                                if (response.data && response.data.results && response.data.results.length) {
                                    deferred.resolve(response);
                                } else {
                                    deferred.resolve(true);
                                }
                            }, function (error) {
                                // called asynchronously if an error occurs
                                // or server returns response with an error status.
                                deferred.reject(error);
                            });
                    }
                    else {
                        deferred.resolve(null);
                    }
                    return deferred.promise;
                }
            }
        }]);

})(window.angular, window.buildfire, window.location);
