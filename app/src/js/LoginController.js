(function() {
    "use strict";
    angular.module('agapApp')
        .controller('LoginController', ['$scope', '$location', 'agapLogin',
            function($scope, $location, agapLogin) {
                var self = this;
                self.user = null;
                self.password = null;
                self.login = function() {
                    agapLogin(self.user, self.password).then(function(userInfo) {
                        $location.path('/');
                    }, function(err) {
                        console.log(err);
                    });
                };
            }
        ]);
})();
