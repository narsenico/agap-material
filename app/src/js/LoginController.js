(function() {
    "use strict";
    angular.module('agapApp')
        .controller('LoginController', ['$scope', '$location', '$mdToast', 'UI', 'agapLogin', 'agapConfig',
            function($scope, $location, $mdToast, UI, agapLogin, agapConfig) {
                var self = this;
                if (agapConfig.rememberLogin) {
                    self.user = agapConfig.lastUser;
                    self.password = agapConfig.lastPassword;
                    self.rememberLogin = true;
                } else {
                    self.user = null;
                    self.password = null;
                    self.rememberLogin = false;
                }

                //
                self.login = function() {
                    agapLogin(self.user, self.password).then(function(userInfo) {
                        //
                        if ((agapConfig.rememberLogin = self.rememberLogin)) {
                            agapConfig.lastUser = self.user;
                            agapConfig.lastPassword = self.password;
                        } else {
                            agapConfig.lastUser = agapConfig.lastPassword = null;
                        }
                        agapConfig.save();
                        //mostro il menu
                        UI.showMenu(true);
                        //reindirizzo alla home
                        $location.path('/');
                    }, function(err) {
                        //console.log(err);
                        $mdToast.show(
                            $mdToast.simple()
                            .content('User or password not valid')
                            .hideDelay(3000)
                        );
                    });
                };

                //nascondo il menu
                UI.showMenu(false);
            }
        ]);
})();
