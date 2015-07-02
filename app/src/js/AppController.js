(function() {
    "use strict";
    angular
        .module('agapApp', ['ngRoute', 'ngMaterial'])
        .config(['$routeProvider', '$mdThemingProvider', '$mdIconProvider',
            function($routeProvider, $mdThemingProvider, $mdIconProvider) {

                //icons configuration
                $mdIconProvider
                    .icon("home", "./assets/svg/home.svg", 24)
                    .icon("menu", "./assets/svg/menu.svg", 24)
                    .icon("contacts", "./assets/svg/account.svg", 24)
                    .icon("calendar", "./assets/svg/calendar-clock.svg", 24)
                    .icon("contacts-add", "./assets/svg/account-plus.svg", 24);

                //theme configuration
                $mdThemingProvider.theme('default')
                    //vedi http://www.google.com/design/spec/style/color.html#color-color-palette
                    .primaryPalette('blue-grey')
                    .accentPalette('pink')
                    .warnPalette('red');

                //
                $routeProvider
                    .when('/contacts', {
                        templateUrl: './src/views/contacts.html'
                    })
                    .when('/calendar', {
                        templateUrl: './src/views/calendar.html'
                    })
                    .otherwise({
                        templateUrl: './src/views/home.html'
                    });

            }
        ])

    //attributes:
    //  - agap-search-rx: search func
    //  - agap-search-rx-callback: callback func
    //  - agap-search-rx-min-length: num
    .directive('agapSearchRx', [function() {

        function link(scope, element, attrs) {

            //retrieve params
            var minLength = parseInt(attrs.agapSearchRxMinLength) || 3;
            //retrieve functions
            var fnSearch = (scope.$eval(attrs.agapSearchRx) || angular.noop);
            var callback = (scope.$eval(attrs.agapSearchRxCallback) || angular.noop);

            //stream
            var keyups = Rx.Observable.fromEvent(element, 'keyup')
                .map(function(e) {
                    return e.target.value;
                })
                .filter(function(text) {
                    return text.length >= minLength;
                });

            var debounced = keyups
                .debounce(500 /* ms */ );

            var distinct = debounced
                .distinctUntilChanged();

            var suggestions = distinct
                .flatMapLatest(fnSearch);

            suggestions.forEach(function(data) {
                callback(data);
            });
        }

        return {
            restrict: 'A',
            link: link
        };
    }])

    .controller('MainController', ['$scope', '$mdSidenav', '$route', function($scope, $mdSidenav, $route) {
        var self = this;

        //menu list
        self.menus = [{
            id: "home",
            caption: "Home",
            icon: "home",
            href: "#"
        }, {
            id: "contacts",
            caption: "Contacts",
            icon: "contacts",
            href: "#/contacts"
        }, {
            id: "calendar",
            caption: "Calendar",
            icon: "calendar",
            href: "#/calendar"
        }];

        //selected menu
        self.selected = self.menus[0];

        //
        self.selectMenu = function(menu) {
            self.selected = menu;
            self.toggleMenu();
        };

        //
        self.toggleMenu = function() {
            $mdSidenav('left').toggle();
        };
    }]);
})();
