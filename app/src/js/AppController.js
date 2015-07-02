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
