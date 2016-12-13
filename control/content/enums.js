(function (angular) {
    "use strict";
    angular
        .module('placesContentEnums', [])
        .constant('CODES', {
            NOT_FOUND: 'NOTFOUND',
            SUCCESS: 'SUCCESS'
        })
        .constant('MESSAGES', {
            ERROR: {
                NOT_FOUND: "No result found",
                CALLBACK_NOT_DEFINED: "Callback is not defined",
                ID_NOT_DEFINED: "Id is not defined",
                DATA_NOT_DEFINED: "Data is not defined",
                OPTION_REQUIRES: "Requires options"
            }
        })
        .constant('EVENTS', {
            ROUTE_CHANGE: "ROUTE_CHANGE",
            DESIGN_LAYOUT_CHANGE: "DESIGN_LAYOUT_CHANGE",
            DESIGN_BGIMAGE_CHANGE: "DESIGN_BGIMAGE_CHANGE",
            ROUTE_CHANGE_1: "ROUTE_CHANGE_1"
        })
        .constant('COLLECTIONS', {
            PlaceInfo: "placeInfo",
            Sections: "sections",
            Items: "items"
        })
        .constant('PATHS', {
            ITEM: "item",
            SECTION: "section",
            HOME: "HOME"
        })
        .constant('GOOGLE_KEYS', {
            API_KEY: 'AIzaSyC4Dw4EzKeyVBXWBsbO9-UgyEARL6WLrlU'
        })
        .constant('DEFAULT_DATA', {
            PLACE_INFO: {
                data: {
                    content: {
                        images: [],
                        descriptionHTML: '',
                        description: '',
                        sortBy: 'Manually',
                        rankOfLastItem: '',
                        rankOfLastItemItems: '',
                        sortByItems: 'Manually',
                        showAllItems: 'true',
                        allItemImage: ''
                    },
                    design: {
                        secListLayout: "sec-list-1-1",
                        mapLayout: "map-1",
                        itemListLayout: "item-list-1",
                        itemDetailsLayout: "item-details-1",
                        secListBGImage: ""
                    },
                    settings: {
                        defaultView: "list",
                        showDistanceIn: "mi"
                    }
                }
            },
            SECTION: {
                data: {
                    mainImage: '',
                    secTitle: '',
                    secSummary: '',
                    itemListBGImage: '',
                    sortBy: '',
                    rankOfLastItem: ''
                }
            },
            ITEM: {
                data: {
                    listImage: '',
                    itemTitle: '',
                    images: [],
                    summary: '',
                    bodyContent: '',
                    bodyContentHTML: '',
                    addressTitle: '',
                    sections: [],
                    address: {
                        lat: '',
                        lng: '',
                        aName: ''
                    },
                    links: [],
                    backgroundImage: ''
                }
            }
        });

})(window.angular);
