(function (angular) {
    'use strict';
    angular
        .module('placesContent')
        .controller('ContentSectionsCtrl', ['$scope', 'PlaceInfo', 'DB', '$timeout', 'COLLECTIONS', 'Orders', 'AppConfig', 'Messaging', 'EVENTS', 'PATHS', '$csv', 'Buildfire',
            function ($scope, PlaceInfo, DB, $timeout, COLLECTIONS, Orders, AppConfig, Messaging, EVENTS, PATHS, $csv, Buildfire) {
                var ContentSection = this;

                Buildfire.deeplink.createLink('section:7');
                Buildfire.deeplink.getData(function (data) {
                    console.log('DeepLInk calleed', data);
                    if (data) alert('deep link data: ' + data);
                });
                ContentSection.info = PlaceInfo;
                AppConfig.setSettings(PlaceInfo.data);
                AppConfig.setAppId(PlaceInfo.id);
                //updateMasterInfo(ContentSection.info);

                var header = {
                    mainImage: 'Section Image',
                    secTitle: 'Section Title',
                    secSummary: "Section Summary",
                    itemListBGImage: 'Item List Background Image'
                };
                var headerRow = ["mainImage", "secTitle", "secSummary", "itemListBGImage"];
                var tmrDelayForMedia = null;

                /**
                 * Create instance of PlaceInfo,Sections and Items db collection
                 * @type {DB}
                 */
                var PlaceInfo = new DB(COLLECTIONS.PlaceInfo),
                    Sections = new DB(COLLECTIONS.Sections),
                    Items = new DB(COLLECTIONS.Items);


                /**
                 * ContentSection.getTemplate() used to download csv template
                 */
                ContentSection.getTemplate = function () {
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


            }]);
})(window.angular, undefined);
