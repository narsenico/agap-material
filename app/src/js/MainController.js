(function() {
    "use strict";
    angular.module('agapApp')
        .controller('MainController', ['$scope', '$mdSidenav', '$location', '$route',
         function($scope, $mdSidenav, $location, $route) {
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

            //indica se il menu deve essere visibile, per default no
            //  diventa visibile grazie all'evento agapMenuVisible
            self.menuVisible = false;
            //selected menu
            self.selected = self.menus[0];
            //carica un url
            self.load = function(url) {
                $location.path(url);
            };
            //rende attivo il menu e nasconde la barra laterale
            self.selectMenu = function(menu) {
                self.selected = menu;
                self.toggleMenu();
                self.load(menu.href);
            };
            //mostra o nascondi il menu laterale (solo su schermi piccoli, altrimenti è sempre visibile)
            self.toggleMenu = function() {
                $mdSidenav('left').toggle();
            };
            //restituisce il titolo principale
            self.getTitle = function() {
                return ($location.path() == '/login' ? 'Login' : self.selected.caption);
            };
            //gestisco l'evento agapMenuVisible
            $scope.$on('agapMenuVisible', function(e, showing) {
                self.menuVisible = showing;
            });

        }]);
})();
