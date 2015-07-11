(function() {
    "use strict";
    angular.module('agapApp')
        .controller('LoginController', ['$scope', '$location', 'UI', 'agapLogin',
            function($scope, $location, UI, agapLogin) {
                var self = this;
                self.user = null;
                self.password = null;

                //
                self.login = function() {
                    agapLogin(self.user, self.password).then(function(userInfo) {
                        //reindirizzo alla home
                        $location.path('/');
                        //mostro il menu
                        UI.showMenu(true);
                    }, function(err) {
                        console.log(err);
                    });
                };
            }
        ]);
})();
