(function (angular, buildfire) {
    'use strict';
    angular
        .module('placesContent')
        .controller('ContentSectionsCtrl', ['$scope', 'DB', '$timeout', 'COLLECTIONS', 'Orders', 'OrdersItems', 'AppConfig', 'Messaging', 'EVENTS', 'PATHS', '$csv', 'Buildfire', 'Modals', 'placesInfo', 'DEFAULT_DATA', 'Utils', '$rootScope',
            function ($scope, DB, $timeout, COLLECTIONS, Orders, OrdersItems, AppConfig, Messaging, EVENTS, PATHS, $csv, Buildfire, Modals, placesInfo, DEFAULT_DATA, Utils, $rootScope) {


                //Show the INT header part.
                Buildfire.appearance.setHeaderVisibility(true);

                //Scroll current view to top when page loaded.
                buildfire.navigation.scrollTop();

                var header = {
                        secTitle: 'Section Title',
                        mainImage: 'Section Image',
                        secSummary: "Section Summary",
                        itemListBGImage: 'Item List Background Image',
                        itemTitle: 'Item Title',
                        summary: 'Item Summary',
                        listImage: 'List Image',
                        images: 'Carousel images',
                        bodyContent: 'Body Content',
                        addressTitle: 'Address Title',
                        address: 'Address',
                        webURL: 'Web URL',
                        sendToEmail: 'Send to Email',
                        smsTextNumber: 'SMS Text Number',
                        phoneNumber: 'Phone Number',
                        facebookURL: 'Facebook URL',
                        twitterURL: 'Twitter URL',
                        instagramURL: 'Instagram URL',
                        googlePlusURL: 'Google+ URL',
                        linkedinURL: 'Linkedin URL',
                        mapAddress: 'Map Address'
                    }
                    , headerRow = ["secTitle", "mainImage", "secSummary", "itemListBGImage", "itemTitle", "summary", "listImage", "images", "bodyContent", "addressTitle", "address", "webURL", "sendToEmail", "smsTextNumber", "phoneNumber", "facebookURL", "twitterURL", "instagramURL", "googlePlusURL", "linkedinURL", "mapAddress"]
                    , tmrDelayForMedia = null
                    , _skip = 0
                    , _limit = 10
                    , _maxLimit = 19
                    , searchOptions = {
                        filter: {"$json.secTitle": {"$regex": '/*'}},
                        skip: _skip,
                        limit: _limit + 1 // the plus one is to check if there are any more
                    }
                    , PlaceInfo = new DB(COLLECTIONS.PlaceInfo)
                    , Sections = new DB(COLLECTIONS.Sections)
                    , Items = new DB(COLLECTIONS.Items)
                    , records = [];

                var ContentSections = this;
                ContentSections.masterInfo = null;

                if (placesInfo) {
                    updateMasterInfo(placesInfo);
                    ContentSections.info = placesInfo;
                }
                else {
                    updateMasterInfo(DEFAULT_DATA.PLACE_INFO);
                    ContentSections.info = DEFAULT_DATA.PLACE_INFO;
                }


                ContentSections.isBusy = false;
                ContentSections.sections = [];
                ContentSections.sortOptions = Orders.options;

                ContentSections.deepLinkUrl = function (url) {
                    buildfire.navigation.scrollTop();
                    Modals.DeeplinkPopupModal(url);
                };

                ContentSections.itemSortableOptions = {
                    handle: '> .cursor-grab',
                    disabled: !(ContentSections.info.data.content.sortBy === Orders.ordersMap.Manually),
                    stop: function (e, ui) {
                        var endIndex = ui.item.sortable.dropindex,
                            maxRank = 0,
                            draggedItem = ContentSections.sections[endIndex];
                        if (draggedItem) {
                            var prev = ContentSections.sections[endIndex - 1],
                                next = ContentSections.sections[endIndex + 1];
                            var isRankChanged = false;
                            if (next) {
                                if (prev) {
                                    draggedItem.data.rank = ((prev.data.rank || 0) + (next.data.rank || 0)) / 2;
                                    isRankChanged = true;
                                } else {
                                    draggedItem.data.rank = (next.data.rank || 0) / 2;
                                    isRankChanged = true;
                                }
                            } else {
                                if (prev) {
                                    draggedItem.data.rank = (((prev.data.rank || 0) * 2) + 10) / 2;
                                    maxRank = draggedItem.data.rank;
                                    isRankChanged = true;
                                }
                            }
                            if (isRankChanged) {

                                Sections.update(draggedItem.id, draggedItem.data).then(function () {
                                    ContentSections.info.data.content.rankOfLastItem = maxRank;
                                }, function () {
                                });
                            }
                        }
                    }
                };
                //option for wysiwyg
                ContentSections.bodyWYSIWYGOptions = {
                    plugins: 'advlist autolink link image lists charmap print preview',
                    skin: 'lightgray',
                    trusted: true,
                    theme: 'modern',
                    plugin_preview_width: "500",
                    plugin_preview_height: "500"
                };
                /**
                 * ContentSections.noMore tells if all data has been loaded
                 */
                ContentSections.noMore = false;
                /* // create a new instance of the buildfire carousel editor
                 ContentSections.editor = new Buildfire.components.carousel.editor("#carousel");*/

                var updateSearchOptions = function () {
                    var order;
                    if (ContentSections.info && ContentSections.info.data && ContentSections.info.data.content)
                        order = Orders.getOrder(ContentSections.info.data.content.sortBy || Orders.ordersMap.Default);

                    if (order) {
                        var sort = {};
                        sort[order.key] = order.order;
                        searchOptions.sort = sort;
                        return true;
                    }
                    else {
                        return false;
                    }
                };

                function saveData(_info) {
                    PlaceInfo.save(_info.data).then(function (data) {
                        updateMasterInfo(_info);
                        AppConfig.setSettings(_info.data);
                        if (_info.id)
                            AppConfig.setAppId(_info.id);
                    }, function (err) {
                        console.error('Error-------', err);
                    });
                }

                function saveDataWithDelay(_info) {
                    if (tmrDelayForMedia) {
                        clearTimeout(tmrDelayForMedia);
                    }
                    if (!isUnchanged(_info)) {
                        tmrDelayForMedia = setTimeout(function () {
                            saveData(_info);
                        }, 1000);
                    }
                }

                function isUnchanged(info) {
                    return angular.equals(info, ContentSections.masterInfo);
                }

                function updateMasterInfo(info) {
                    ContentSections.masterInfo = angular.copy(info);
                }

                function isValidItem(item, index, array) {
                    if (item['Section Title'])
                        return true;
                    else
                        return false;
                }

                function validateCsv(items) {
                    if (!Array.isArray(items) || !items.length) {
                        return false;
                    }
                    return items.every(isValidItem);
                }

                /**
                 * getRecords function get the  all items from DB
                 * @param searchOption
                 * @param records
                 * @param callback
                 */
                function getRecords(searchOption, records, callback) {
                    Sections.find(searchOption).then(function (result) {
                        if (result.length <= _maxLimit) {// to indicate there are more
                            records = records.concat(result);
                            return callback(records);
                        }
                        else {
                            result.pop();
                            searchOption.skip = searchOption.skip + _maxLimit;
                            records = records.concat(result);
                            return getRecords(searchOption, records, callback);
                        }
                    }, function (error) {
                        throw (error);
                    });
                }

                function exporter() {
                    var allSections = {}, json = [];
                    Sections.find({filter: {"$json.secTitle": {"$regex": '/*'}}}).then(function (sections) {


                        for (var _j = 0; _j < sections.length; _j++) {
                            allSections[sections[_j].id] = {
                                secTitle: sections[_j].data.secTitle,
                                secSummary: sections[_j].data.secSummary,
                                mainImage: sections[_j].data.mainImage,
                                itemListBGImage: sections[_j].data.itemListBGImage
                            };
                        }

                        console.log('allSections', allSections);

                        Items.find({filter: {"$json.itemTitle": {"$regex": '/*'}}}).then(function (items) {
                            console.log('Items in epxort--------------------------', items);

                            if (items.length == 0) {

                                Object.keys(allSections).forEach(function (key, index) {
                                    json.push(allSections[key]);
                                });
                            }
                            else {

                                for (var _ind = 0; _ind < items.length; _ind++) {
                                    items[_ind].data.address = items[_ind].data.address.aName;
                                    if (items[_ind].data.sections.length > 1) {
                                        for (var _i = 0; _i < items[_ind].data.sections.length; _i++) {
                                            allSections[items[_ind].data.sections[_i]].done = true;
                                            items[_ind].data.secTitle = allSections[items[_ind].data.sections[_i]].secTitle;
                                            items[_ind].data.secSummary = allSections[items[_ind].data.sections[_i]].secSummary;
                                            items[_ind].data.mainImage = allSections[items[_ind].data.sections[_i]].mainImage;
                                            items[_ind].data.itemListBGImage = allSections[items[_ind].data.sections[_i]].itemListBGImage;

                                            json.push(items[_ind].data);
                                        }

                                    }
                                    else {
                                        if (allSections[items[_ind].data.sections[0]]) {
                                            allSections[items[_ind].data.sections[0]].done = true;
                                            items[_ind].data.secTitle = allSections[items[_ind].data.sections[0]].secTitle;
                                            items[_ind].data.secSummary = allSections[items[_ind].data.sections[0]].secSummary;
                                            items[_ind].data.mainImage = allSections[items[_ind].data.sections[0]].mainImage;
                                            items[_ind].data.itemListBGImage = allSections[items[_ind].data.sections[0]].itemListBGImage;
                                        }
                                        else
                                            items[_ind].data.secTitle = 'Default Section';
                                        json.push(items[_ind].data);
                                    }

                                }

                                Object.keys(allSections).forEach(function (key, index) {
                                    if (allSections[key].done != true)
                                        json.push(allSections[key]);
                                });


                            }
                            console.log('Json in export csv-----------------', json);
                            var csv = $csv.jsonToCsv(angular.toJson(json), {
                                header: header
                            });
                            console.log('Csv---------------------------------------------------------', csv);
                            if (csv) {
                                $csv.download(csv, "Export.csv");
                            }
                            else {
                                $csv.download([], "Export.csv");
                            }
                        }, function () {
                        });

                    }, function (error) {
                        throw (error);
                    });
                }

                /* Buildfire.deeplink.createLink('section:7');
                 Buildfire.deeplink.getData(function (data) {
                 if (data) alert('deep link data: ' + data);
                 });*/

                /**
                 * ContentSections.getTemplate() used to download csv template
                 */
                ContentSections.getTemplate = function () {
                    var templateData = [{
                        secTitle: '',
                        mainImage: '',
                        secSummary: '',
                        itemListBGImage: '',
                        itemTitle: '',
                        summary: '',
                        listImage: '',
                        images: '',
                        bodyContent: '',
                        addressTitle: '',
                        address: '',
                        webURL: '',
                        sendToEmail: '',
                        smsTextNumber: '',
                        phoneNumber: '',
                        facebookURL: '',
                        twitterURL: '',
                        instagramURL: '',
                        googlePlusURL: '',
                        linkedinURL: '',
                        mapAddress: ''
                    }];
                    var csv = $csv.jsonToCsv(angular.toJson(templateData), {
                        header: header
                    });
                    $csv.download(csv, "Template.csv");
                };
                /**
                 * method to open the importCSV Dialog
                 */
                ContentSections.openImportCSVDialog = function () {
                    buildfire.navigation.scrollTop();

                    var sectionNameArray = [];
                    var sectionArray = [];
                    var sectionItemsCollection = {};

                    var rankSec = ContentSections.info.data.content.rankOfLastItem || 0;
                    var rankItem = ContentSections.info.data.content.rankOfLastItemItems || 0;

                    $csv.import(headerRow).then(function (rows) {
                            console.log('Rows in Import CSV---------------------', rows);

                            function addItems(secId, secTitle) {
                                var secTitle_removedSpace = secTitle.replace(/ /g, '');
                                var items = sectionItemsCollection[secTitle_removedSpace];
                                if (items.length == 0) {
                                    console.log('no items for ', secTitle);
                                    return;
                                }

                                if (secId === undefined) {
                                    console.log('section id undefined', secTitle);
                                }

                                angular.forEach(items, function (item) {
                                    rankItem = rankItem + 10;
                                    item.sections = [secId];
                                    item.rank = rankItem;
                                });
                                console.log('adding items', secTitle, items);
                                Items.insert(items).then(function (items_added) {
                                    console.log('items_added', items_added);
                                });
                            };

                            var addItem = function (row, sec) {

                                if (!row['Item Title']) {
                                    return;
                                }

                                var images = [];


                                if (row['Carousel images']) {
                                    row['Carousel images'] = row['Carousel images'].replace(/ /g, '');
                                    if (row['Carousel images'].indexOf(',') < 0) {
                                        images.push({
                                            action: "noAction",
                                            iconUrl: row['Carousel images'],
                                            title: "image"
                                        });
                                    }
                                    else {
                                        var tempImages = row['Carousel images'].split(',');
                                        angular.forEach(tempImages, function (itr) {
                                            images.push({
                                                action: "noAction",
                                                iconUrl: itr,
                                                title: "image"
                                            });
                                        });
                                    }
                                }

                                var links = [];
                                if (row['Web URL']) {
                                    links.push({
                                        title: "Link",
                                        url: row['Web URL'],
                                        action: "linkToWeb",
                                        openIn: "_blank"
                                    });
                                }

                                if (row['Send to Email']) {
                                    links.push({
                                        title: "Send Email",
                                        subject: "",
                                        body: "",
                                        email: row['Send to Email'],
                                        action: "sendEmail"
                                    });
                                }

                                if (row['SMS Text Number']) {
                                    links.push({
                                        title: "Send SMS",
                                        subject: "action Item SMS Example",
                                        body: "We are testing action Item send SMS",
                                        phoneNumber: row.smsTextNumber,
                                        action: "sendSms"
                                    });
                                }

                                if (row['Phone Number']) {
                                    links.push({
                                        title: "Call Number",
                                        phoneNumber: row['Phone Number'],
                                        action: "callNumber"
                                    });
                                }
                                if (row['Facebook URL']) {
                                    links.push({
                                        title: "Link to Facebook",
                                        url: row['Facebook URL'],
                                        action: "linkToSocialFacebook"
                                    });
                                }

                                if (row['Twitter URL']) {
                                    links.push({
                                        title: "Link to Twitter",
                                        url: row['Twitter URL'],
                                        action: "linkToSocialTwitter"
                                    });
                                }

                                if (row['Google+ URL']) {
                                    links.push({
                                        title: "Link to Google",
                                        url: row['Google+ URL'],
                                        action: "linkToSocialGoogle"
                                    });
                                }

                                if (row['Linkedin URL']) {
                                    links.push({
                                        title: "Link to LinkedIn",
                                        url: row['Linkedin URL'],
                                        action: "linkToSocialLinkedIn"
                                    });
                                }

                                if (row['Instagram URL']) {
                                    links.push({
                                        title: "Link to Instagram",
                                        url: row['Instagram URL'],
                                        action: "linkToSocialInstagram"
                                    });
                                }

                                if (row['Map Address'] && false) {

                                    Utils.getCoordinatesFromAddress(row['Map Address']).then(function (coordinates) {
                                        if (!coordinates) {
                                            return;
                                        }
                                        console.log('coordinates', coordinates);
                                        if (coordinates.data && coordinates.data.status == 'OK') {
                                            links.push({
                                                title: "Navigate to address title",
                                                lat: coordinates.data.results[0].geometry.location.lat,
                                                lng: coordinates.data.results[0].geometry.location.lng,
                                                address: row['Map Address'],
                                                action: "navigateToAddress"
                                            });


                                            if (row['Address']) {
                                                Utils.getCoordinatesFromAddress(row['Address']).then(function (coord) {
                                                    if (!coord) {
                                                        return;
                                                    }
                                                    console.log('original coordinates', coord);
                                                    if (coord.data && coord.data.status == 'OK') {
                                                        sectionItemsCollection[sec].push({
                                                            itemTitle: row['Item Title'],
                                                            summary: row['Item Summary'],
                                                            listImage: row['List Image'],
                                                            images: images,
                                                            bodyContent: row['Body Content'],
                                                            addressTitle: row['Address Title'],
                                                            address: {
                                                                aName: row['Address'],
                                                                lat: coord.data.results[0].geometry.location.lat,
                                                                lng: coord.data.results[0].geometry.location.lng
                                                            },
                                                            dateCreated: +new Date(),
                                                            rank: rankSec,
                                                            links: links
                                                        });
                                                    }
                                                    else {
                                                        sectionItemsCollection[sec].push({
                                                            itemTitle: row['Item Title'],
                                                            summary: row['Item Summary'],
                                                            listImage: row['List Image'],
                                                            images: images,
                                                            bodyContent: row['Body Content'],
                                                            addressTitle: row['Address Title'],
                                                            address: {
                                                                aName: row['Address'],
                                                                lat: 0,
                                                                lng: 0
                                                            },
                                                            dateCreated: +new Date(),
                                                            rank: rankSec,
                                                            links: links
                                                        });
                                                    }
                                                }, function () {
                                                    sectionItemsCollection[sec].push({
                                                        itemTitle: row['Item Title'],
                                                        summary: row['Item Summary'],
                                                        listImage: row['List Image'],
                                                        images: images,
                                                        bodyContent: row['Body Content'],
                                                        addressTitle: row['Address Title'],
                                                        address: {aName: '', lat: 0, lng: 0},
                                                        dateCreated: +new Date(),
                                                        rank: rankSec,
                                                        links: links
                                                    });
                                                });
                                            }
                                            else {
                                                sectionItemsCollection[sec].push({
                                                    itemTitle: row['Item Title'],
                                                    summary: row['Item Summary'],
                                                    listImage: row['List Image'],
                                                    images: images,
                                                    bodyContent: row['Body Content'],
                                                    addressTitle: row['Address Title'],
                                                    address: {aName: '', lat: 0, lng: 0},
                                                    dateCreated: +new Date(),
                                                    rank: rankSec,
                                                    links: links
                                                });
                                            }
                                        }
                                    }, function () {
                                        if (row['Address']) {
                                            Utils.getCoordinatesFromAddress(row['Address']).then(function (coord) {
                                                if (!coord) {
                                                    return;
                                                }
                                                console.log('original coordinates', coord);
                                                if (coord.data && coord.data.status == 'OK') {
                                                    sectionItemsCollection[sec].push({
                                                        itemTitle: row['Item Title'],
                                                        summary: row['Item Summary'],
                                                        listImage: row['List Image'],
                                                        images: images,
                                                        bodyContent: row['Body Content'],
                                                        addressTitle: row['Address Title'],
                                                        address: {
                                                            aName: row['Address'],
                                                            lat: coord.data.results[0].geometry.location.lat,
                                                            lng: coord.data.results[0].geometry.location.lng
                                                        },
                                                        dateCreated: +new Date(),
                                                        rank: rankSec,
                                                        links: links
                                                    });
                                                }
                                                else {
                                                    sectionItemsCollection[sec].push({
                                                        itemTitle: row['Item Title'],
                                                        summary: row['Item Summary'],
                                                        listImage: row['List Image'],
                                                        images: images,
                                                        bodyContent: row['Body Content'],
                                                        addressTitle: row['Address Title'],
                                                        address: {
                                                            aName: row['Address'],
                                                            lat: 0,
                                                            lng: 0
                                                        },
                                                        dateCreated: +new Date(),
                                                        rank: rankSec,
                                                        links: links
                                                    });
                                                }
                                            }, function () {
                                                sectionItemsCollection[sec].push({
                                                    itemTitle: row['Item Title'],
                                                    summary: row['Item Summary'],
                                                    listImage: row['List Image'],
                                                    images: images,
                                                    bodyContent: row['Body Content'],
                                                    addressTitle: row['Address Title'],
                                                    address: {aName: '', lat: 0, lng: 0},
                                                    dateCreated: +new Date(),
                                                    rank: rankSec,
                                                    links: links
                                                });
                                            });
                                        }
                                        else {
                                            sectionItemsCollection[sec].push({
                                                itemTitle: row['Item Title'],
                                                summary: row['Item Summary'],
                                                listImage: row['List Image'],
                                                images: images,
                                                bodyContent: row['Body Content'],
                                                addressTitle: row['Address Title'],
                                                address: {aName: '', lat: 0, lng: 0},
                                                dateCreated: +new Date(),
                                                rank: rankSec,
                                                links: links
                                            });
                                        }
                                    });


                                }
                                else {
                                    if (row['Address'] ) {
                                        Utils.getCoordinatesFromAddress(row['Address']).then(function (coord) {
                                            if (!coord) {
                                                return;
                                            }
                                            console.log('original coordinates', coord);
                                            if (coord.data && coord.data.status == 'OK') {
                                                sectionItemsCollection[sec].push({
                                                    itemTitle: row['Item Title'],
                                                    summary: row['Item Summary'],
                                                    listImage: row['List Image'],
                                                    images: images,
                                                    bodyContent: row['Body Content'],
                                                    addressTitle: row['Address Title'],
                                                    address: {
                                                        aName: row['Address'],
                                                        lat: coord.data.results[0].geometry.location.lat,
                                                        lng: coord.data.results[0].geometry.location.lng
                                                    },
                                                    dateCreated: +new Date(),
                                                    rank: rankSec,
                                                    links: links
                                                });
                                            }
                                            else {
                                                sectionItemsCollection[sec].push({
                                                    itemTitle: row['Item Title'],
                                                    summary: row['Item Summary'],
                                                    listImage: row['List Image'],
                                                    images: images,
                                                    bodyContent: row['Body Content'],
                                                    addressTitle: row['Address Title'],
                                                    address: {
                                                        aName: row['Address'],
                                                        lat: 0,
                                                        lng: 0
                                                    },
                                                    dateCreated: +new Date(),
                                                    rank: rankSec,
                                                    links: links
                                                });
                                            }
                                        }, function () {
                                            console.log('problem in gmaps')
                                            sectionItemsCollection[sec].push({
                                                itemTitle: row['Item Title'],
                                                summary: row['Item Summary'],
                                                listImage: row['List Image'],
                                                images: images,
                                                bodyContent: row['Body Content'],
                                                addressTitle: row['Address Title'],
                                                address: {aName: '', lat: 0, lng: 0},
                                                dateCreated: +new Date(),
                                                rank: rankSec,
                                                links: links
                                            });
                                        });
                                    }
                                    else {
                                        sectionItemsCollection[sec].push({
                                            itemTitle: row['Item Title'],
                                            summary: row['Item Summary'],
                                            listImage: row['List Image'],
                                            images: images,
                                            bodyContent: row['Body Content'],
                                            addressTitle: row['Address Title'],
                                            address: {aName: row['Address'], lat: 0, lng: 0},
                                            dateCreated: +new Date(),
                                            rank: rankSec,
                                            links: links
                                        });
                                    }
                                }

                            };

                            if (rows && rows.length) {
                                ContentSections.csvProcessing = true;
                                angular.forEach(rows, function (row) {
                                    if (isValidItem(row)) {
                                        var secTitle = row['Section Title'];
                                        var secTitle_spaceRemoved = secTitle.replace(/ /g, '');
                                        if (sectionNameArray.indexOf(secTitle) == -1) {
                                            sectionNameArray.push(secTitle);
                                            sectionArray.push({
                                                secTitle: row['Section Title'],
                                                mainImage: row['Section Image'],
                                                secSummary: row['Section Summary'],
                                                itemListBGImage: row['Item List Background Image']
                                            });

                                            sectionItemsCollection[secTitle_spaceRemoved] = [];
                                            addItem(row, secTitle_spaceRemoved);
                                        }
                                        else {
                                            addItem(row, secTitle_spaceRemoved);
                                        }
                                    }
                                });
                                var index = -1;
                                angular.forEach(sectionArray, function (sec) {

                                    $timeout(function () {

                                        rankSec = rankSec + 10;
                                        Sections.insert({
                                            secTitle: sec.secTitle,
                                            mainImage: sec.mainImage,
                                            secSummary: sec.secSummary,
                                            itemListBGImage: sec.itemListBGImage,
                                            dateCreated: +new Date(),
                                            rank: rankSec
                                        }).then(function (newlyCreated) {
                                            if (++index == (sectionArray.length - 1)) {
                                                $timeout(function () {
                                                    ContentSections.csvProcessing = null;
                                                    ContentSections.info.data.content.rankOfLastItem = rankSec;
                                                    ContentSections.info.data.content.rankOfLastItemItems = rankItem;
                                                    $timeout(function () {
                                                        ContentSections.reloadSections();
                                                    }, 2000);
                                                }, 2000);
                                            }
                                            console.log('newlyCreated>>>', newlyCreated);
                                            if (newlyCreated.id === undefined) {
                                                console.error('no id for', sec.secTitle);
                                            }
                                            else
                                                addItems(newlyCreated.id, sec.secTitle);


                                        }, function () {

                                        });
                                    }, 100);


                                    /* Sections.find({
                                     filter: {
                                     "$json.secTitle": {
                                     "$eq": sec.secTitle
                                     }
                                     },
                                     skip: 0,
                                     limit: 1
                                     }).then(function (found) {
                                     console.log('found>>>', found);
                                     if (found.length) {
                                     addItems(found[0].id, sec.secTitle);
                                     }
                                     else {
                                     console.log('add ', sec);
                                     rankSec = rankSec + 10;
                                     Sections.insert({
                                     secTitle: sec.secTitle,
                                     mainImage: sec.mainImage,
                                     secSummary: sec.secSummary,
                                     itemListBGImage: sec.itemListBGImage,
                                     dateCreated: +new Date(),
                                     rank: rankSec
                                     }).then(function (newlyCreated) {
                                     console.log('newlyCreated>>>', newlyCreated);
                                     if (newlyCreated.id === undefined) {
                                     debugger;
                                     }
                                     else
                                     addItems(newlyCreated.id, sec.secTitle);
                                     }, function () {

                                     });
                                     }
                                     }, function () {

                                     });*/

                                });
                            }
                            else {
                                ContentSections.csvDataInvalid = true;
                                $timeout(function hideCsvDataError() {
                                    ContentSections.csvDataInvalid = null;
                                }, 2000);
                            }

                        }, function
                            () {
                        }
                    )
                    ;


                    /*  $csv.import(headerRow).then(function (rows) {
                     console.log('Rows in Import CSV---------------------', rows);
                     //ContentSections.loading = true;
                     var secArray = [],
                     itemArray = [],
                     itemSecMap = [];
                     var existingSectionNamesCollection = {};


                     var checkIfSectionExistsAndReturnSectionId = function (sectionTitle) {
                     var sectionTitle_removedSpace = sectionTitle.replace(/ /g, '');
                     if (existingSectionNamesCollection[sectionTitle_removedSpace]) {
                     return existingSectionNamesCollection[sectionTitle_removedSpace];
                     }
                     else {

                     }
                     };

                     if (rows && rows.length) {
                     var rankSec = ContentSections.info.data.content.rankOfLastItem || 0;
                     var rankItem = ContentSections.info.data.content.rankOfLastItem || 0;
                     angular.forEach(rows, function (row) {
                     rankSec += 10;
                     rankItem += 10;
                     if (isValidItem(row)) {
                     console.log('Data is valid----------------------------------------------');
                     Sections.insert({
                     secTitle: row['Section Title'],
                     mainImage: row['Section Image'],
                     secSummary: row['Section Summary'],
                     itemListBGImage: row['Item List Background Image'],
                     dateCreated: +new Date(),
                     rank: rankSec
                     }).then(function (data) {
                     console.log('Sections inserted=--------------------', data);
                     if (data && data.id) {
                     if (row['Address'] != '') {
                     Utils.getCoordinatesFromAddress(row['Address']).then(function (coordinates) {
                     if (!coordinates) {
                     ContentSections._lng = ContentSections._lat = 0;
                     return;
                     }
                     console.log('coordinates', coordinates);
                     if (coordinates.data.status == 'OK') {
                     ContentSections._lng = coordinates.data.results[0].geometry.location.lng;
                     ContentSections._lat = coordinates.data.results[0].geometry.location.lat;
                     }
                     else {
                     ContentSections._lng = ContentSections._lat = 0;
                     }
                     addItem(row, data);
                     }, function () {
                     ContentSections._lng = ContentSections._lat = 0;
                     addItem(row, data);
                     });
                     }
                     else {
                     ContentSections._lng = ContentSections._lat = 0;
                     addItem(row, data);
                     }
                     //addItem(row, data);
                     }
                     }, function errorHandler(error) {
                     console.error(error);
                     //ContentHome.loading = false;
                     $scope.$apply();
                     });
                     }
                     else {
                     console.log('Data is InValid----------------------------------------------');
                     ContentSections.csvDataInvalid = true;
                     $timeout(function hideCsvDataError() {
                     ContentSections.csvDataInvalid = false;
                     }, 2000);
                     }
                     });
                     }
                     else {
                     $scope.$apply();
                     }

                     $timeout(function () {
                     ContentSections.sections = [];
                     ContentSections.isBusy = ContentSections.noMore = false;
                     ContentSections.getMore();
                     }, 4000);
                     }, function (error) {
                     //ContentHome.loading = false;
                     $scope.$apply();
                     //do something on cancel
                     });*/
                };


                ContentSections.reloadSections = function () {
                    ContentSections.sections = [];
                    ContentSections.isBusy = ContentSections.noMore = false;
                    ContentSections.getMore();
                };

                /**
                 * ContentSections.exportCSV() used to export people list data to CSV
                 */
                ContentSections.exportCSV = function () {
                    exporter();
                };
                /**
                 * ContentSections.removeListSection() used to delete an item from section list
                 * @param _index tells the index of item to be deleted.
                 */
                ContentSections.removeListSection = function (_index, event) {

                    if ("undefined" == typeof _index) {
                        return;
                    }
                    var item = ContentSections.sections[_index];

                    if ("undefined" !== typeof item) {
                        //buildfire.navigation.scrollTop();

                        Modals.removePopupModal({title: '', event: event}).then(function (result) {
                            if (result) {
                                Sections.delete(item.id).then(function (data) {
                                    ContentSections.sections.splice(_index, 1);

                                    var itemOptions = {
                                        filter: {'$and': [{"$json.itemTitle": {"$regex": '/*'}}, {"$json.sections": {"$all": [item.id]}}]}
                                    };
                                    Items.find(itemOptions).then(function (items) {
                                        console.log(items);
                                        items.forEach(function (_item) {
                                            if (_item.data.sections.length == 1) {
                                                Items.delete(_item.id, function () {
                                                }, function () {
                                                });
                                            }
                                            else {
                                                _item.data.sections.splice(_item.data.sections.indexOf(item.id), 1);
                                                Items.update(_item.id, _item.data, function () {
                                                }, function () {
                                                });
                                            }
                                        });
                                    }, function () {
                                    });

                                }, function (err) {
                                    console.error('Error while deleting an item-----', err);
                                });
                            }
                            else {
                                console.info('Unable to load data.');
                            }
                        }, function (cancelData) {
                            //do something on cancel
                        });
                    }
                };
                /**
                 * ContentSections.getMore is used to load the items
                 */
                ContentSections.getMore = function () {
                    //if (ContentSections.isBusy && !ContentSections.noMore) {
                    if (ContentSections.isBusy || ContentSections.noMore) {
                        return;
                    }
                    updateSearchOptions();
                    console.log('searching for ', searchOptions);
                    ContentSections.isBusy = true;
                    Sections.find(searchOptions).then(function success(result) {
                        if (result.length <= _limit) {// to indicate there are more
                            ContentSections.noMore = true;
                        }
                        else {
                            result.pop();
                            searchOptions.skip = searchOptions.skip + _limit;
                            ContentSections.noMore = false;
                        }
                        ContentSections.sections = ContentSections.sections ? ContentSections.sections.concat(result) : result;
                        ContentSections.isBusy = false;
                    }, function fail() {
                        ContentSections.isBusy = false;
                    });
                };
                /**
                 * ContentSections.searchListSection() used to search items section
                 * @param value to be search.
                 */
                ContentSections.searchListSection = function (value) {
                    if (value) {
                        ContentSections.showSearchResults = true;
                    }
                    else {
                        ContentSections.showSearchResults = false;
                    }
                    searchOptions.skip = 0;
                    /*reset the skip value*/
                    ContentSections.noMore = false;
                    ContentSections.isBusy = false;
                    ContentSections.sections = [];
                    value = value.trim();
                    if (!value) {
                        value = '/*';
                    }
                    searchOptions.filter = {"$json.secTitle": {"$regex": value, "$options": "i"}};
                    console.log('searching>>', angular.copy(searchOptions));
                    ContentSections.getMore();
                };
                /**
                 * ContentHome.toggleSortOrder() to change the sort by
                 */
                ContentSections.toggleSortOrder = function (name) {
                    if (!name) {
                        console.info('There was a problem sorting your data');
                    } else {
                        var sortOrder = Orders.getOrder(name || Orders.ordersMap.Default);
                        ContentSections.noMore = false;
                        searchOptions.skip = 0;
                        ContentSections.isBusy = false;
                        ContentSections.info.data.content.sortBy = name;
                        ContentSections.sections = [];
                        ContentSections.getMore();
                        ContentSections.itemSortableOptions.disabled = !(ContentSections.info.data.content.sortBy === Orders.ordersMap.Manually);
                    }
                };

                ContentSections.selectAllItemImage = function () {
                    buildfire.navigation.scrollTop();
                    Modals.selectAllItemImageModal(ContentSections.info).then(function (data) {
                        console.log('Select Image Popup----Success----------', data);
                        ContentSections.info = data;
                    }, function (err) {
                        console.log('Select Image PopUp --Error-----------', err);
                    });
                };

                if ($rootScope.dontPropagate == true)
                    $rootScope.dontPropagate = false;
                else
                    Messaging.sendMessageToWidget({
                        name: EVENTS.ROUTE_CHANGE,
                        message: {
                            path: PATHS.HOME
                        }
                    });
                $scope.$watch(function () {
                    return ContentSections.info;
                }, saveDataWithDelay, true);

            }
        ])
    ;
})(window.angular, window.buildfire);