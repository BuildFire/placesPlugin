(function (angular) {
    'use strict';
    angular
        .module('placesContent')
        .controller('ContentSectionsCtrl', ['$scope', 'PlaceInfo', 'DB', '$timeout', 'COLLECTIONS', 'Orders', 'AppConfig', 'Messaging', 'EVENTS', 'PATHS', '$csv', 'Buildfire',
            function ($scope, PlaceInfo, DB, $timeout, COLLECTIONS, Orders, AppConfig, Messaging, EVENTS, PATHS, $csv, Buildfire) {
                var ContentSections = this;

                Buildfire.deeplink.createLink('section:7');
                Buildfire.deeplink.getData(function (data) {
                    console.log('DeepLInk calleed', data);
                    if (data) alert('deep link data: ' + data);
                });
                ContentSections.info = PlaceInfo;
                AppConfig.setSettings(PlaceInfo.data);
                AppConfig.setAppId(PlaceInfo.id);
                //updateMasterInfo(ContentSections.info);

                var header = {
                    mainImage: 'Section Image',
                    secTitle: 'Section Title',
                    secSummary: "Section Summary",
                    itemListBGImage: 'Item List Background Image'
                };
                var headerRow = ["mainImage", "secTitle", "secSummary", "itemListBGImage"];
                var tmrDelayForMedia = null;
                var _skip = 0,
                    _limit = 5,
                    _maxLimit = 19,
                    searchOptions = {
                        filter: {"$json.secTitle": {"$regex": '/*'}},
                        skip: _skip,
                        limit: _limit + 1 // the plus one is to check if there are any more
                    };

                /**
                 * Create instance of PlaceInfo,Sections and Items db collection
                 * @type {DB}
                 */
                var PlaceInfo = new DB(COLLECTIONS.PlaceInfo),
                    Sections = new DB(COLLECTIONS.Sections),
                    Items = new DB(COLLECTIONS.Items);


                /**
                 * ContentSections.getTemplate() used to download csv template
                 */
                ContentSections.getTemplate = function () {
                    var templateData = [{
                        mainImage: '',
                        secTitle: '',
                        secSummary: '',
                        itemListBGImage: ''
                    }];
                    var csv = $csv.jsonToCsv(angular.toJson(templateData), {
                        header: header
                    });
                    $csv.download(csv, "Template.csv");
                };


                /*
                 * Fetch data from datastore
                 */
                var init = function () {
                    var success = function (result) {
                            ContentSections.sections = result;
                            console.log('>>>>>>>>>>>>>',result);
                        }
                        , error = function (err) {
                            console.error('Error while getting data', err);
                        };
                    Sections.find(searchOptions).then(success, error);
                };

                init();




            }]);
})(window.angular, undefined);
