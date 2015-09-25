(function (angular, window) {
    angular
        .module('placesWidget')
        .controller('WidgetSectionCtrl', ['$scope', '$window', 'AppConfig', 'Messaging', 'Buildfire', 'COLLECTIONS', 'EVENTS', '$timeout', function ($scope, $window, AppConfig, Messaging, Buildfire, COLLECTIONS, EVENTS, $timeout) {
            var WidgetSection = this;
            var Sections = new DB(COLLECTIONS.Sections),
                Items = new DB(COLLECTIONS.Items);

            WidgetSection.section = $routeParams.sectionId;
            console.log(ContentItems.section);
            WidgetSection.isBusy = false;
            /* tells if data is being fetched*/
            WidgetSection.items = [];
            var _skip = 0,
                _limit = 5,
                _maxLimit = 19,
                searchOptions = {
                    filter: {'$and': [{"$json.itemTitle": {"$regex": '/*'}}, {"$json.sections": {"$all": [WidgetSection.section]}}]},
                    skip: _skip,
                    limit: _limit + 1 // the plus one is to check if there are any more
                };
        }]);
})(window.angular, window);