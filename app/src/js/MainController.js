(function() {
    "use strict";
    angular.module('agapApp')
        .controller('MainController', ['$scope', '$mdSidenav', '$location',
         function($scope, $mdSidenav, $location) {
            var self = this;

            //menu list
            self.menus = [{
                id: "home",
                caption: "Home",
                icon: "home",
                href: "/home"
            }, {
                id: "contacts",
                caption: "Contacts",
                icon: "contacts",
                href: "/contacts"
            }, {
                id: "calendar",
                caption: "Calendar",
                icon: "calendar",
                href: "/calendar"
            }];

            //selected menu
            self.selected = self.menus[0];

            //
            self.load = function(url) {
                $location.path(url);
            };

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
