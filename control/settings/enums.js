(function (angular) {
    "use strict";
    angular
        .module('placesEnums', [])
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
        .constant('COLLECTIONS', {
            PlaceInfo: "placeInfo"
        })
        .constant('DEFAULT_DATA', {
            PLACE_INFO: {
                data: {
                    content: {
                        images: [],
                        descriptionHTML: '<p>&nbsp;<br></p>',
                        description: '<p>&nbsp;<br></p>',
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
            }
        });
})(window.angular, undefined);