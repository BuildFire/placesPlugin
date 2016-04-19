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
        .constant('EVENTS', {
            ROUTE_CHANGE: "ROUTE_CHANGE",
            DESIGN_LAYOUT_CHANGE: "DESIGN_LAYOUT_CHANGE",
            DESIGN_BGIMAGE_CHANGE: "DESIGN_BGIMAGE_CHANGE",
            ROUTE_CHANGE_1: "ROUTE_CHANGE_1",
            ITEM_UPDATED: "ITEM_UPDATED"
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
        .constant('DEFAULT_VIEWS', {
            MAP: "map",
            LIST: "list"
        });
})(window.angular);