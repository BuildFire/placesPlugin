xdescribe("SettingsHomeCtrl", function () {

    var $rootScope,
        $scope,
        controller,
        q;


    beforeEach(function () {
        module('placesSettings');

        inject(function ($injector, $q) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            controller = $injector.get('$controller')('SettingsHomeCtrl', {
                $scope: $scope,
                COLLECTIONS: $injector.get('COLLECTIONS'),
                DB: $injector.get('DB'),
                PlaceInfo: {
                    id: '1', data: {
                        content: {
                            images: [],
                            descriptionHTML: '',
                            description: '',
                            sortBy: 'Newest',
                            rankOfLastItem: ''
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
                            showDistanceIn: "miles"
                        }
                    }
                },
                $timeout: $injector.get('$timeout'),
                Buildfire: $injector.get('Buildfire'),
                EVENTS: $injector.get('EVENTS'),
                Messaging: $injector.get('Messaging')
            });
            q = $q;
        });
    });


    describe('Initialization', function () {
        it('should initialize the listLayouts to the default value', function () {
            expect(controller.placeInfo).toBeDefined();
        });

        it('should initialize the itemLayouts to the default value', function () {
            expect(controller.change).toBeDefined();
        });
    });
});