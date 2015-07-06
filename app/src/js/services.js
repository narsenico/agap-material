(function() {
    "use strict";

    angular.module('agapApp')

    //
    .factory('agapConfig', [function() {

        var config = {
            DEBUG: 5,
            INFO: 4,
            WARN: 3,
            ERROR: 2,
            CRITICAL: 1,
            rememberLogin: false,
            logLevel: 5,
            save: function() {
                localStorage.setItem('agapConfig', JSON.stringify({
                    rememberLogin: this.rememberLogin,
                    logLevel: this.logLevel
                }));
            }
        };

        var localCfg = angular.extend(config, JSON.parse(localStorage.getItem('agapConfig')));
        return localCfg;
    }])

    //
    .factory('remoteLog', ['agapConfig', function(agapConfig) {
        //TODOD log remoto (asincrono, aggiungere i log ad una coda e ogni tanto fare la chiamata remota)
        return {
            log: function() {
                if (agapConfig.logLevel >= agapConfig.DEBUG) {
                    console.log.apply(console, Array.prototype.slice.apply(arguments));
                }
            }
        };

    }])

    //login service
    //  - (no args): return: user info
    //  - user, password: login, return: user info
    .factory('agapLogin', [function($rootScope, remoteLog) {
        var userInfo = {
            isLogged: false,
            name: null,
            groups: []
        };

        var loginService = function(user, password) {
            if (user === undefined) {
                return userInfo;
            } else {
                //TODO login
                remoteLog.log('LOGIN', user);
                userInfo.isLogged = true;
                userInfo.name = user;
                userInfo.groups = ['user'];
                return userInfo;
            }
        };
        return loginService;
    }])

    //
    .factory('agapData', [function() {

    }]);

})();
