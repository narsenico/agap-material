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
    //  - (no args): return: promise user info
    //  - user, password: login, return: promise user info
    .factory('agapLogin', ['$q', 'remoteLog', function($q, remoteLog) {
        var userInfo = {
            isLogged: false,
            name: null,
            groups: []
        };

        var loginService = function(user, password) {
            var def = $q.defer();
            if (user !== undefined) {
            	console.log("fake login", user, password);
                setTimeout(function() {
                    if (user == password) {
				        //TODO fake login
	                    remoteLog.log('LOGIN', user);
	                    userInfo.isLogged = true;
	                    userInfo.name = user;
	                    userInfo.groups = ['user'];
	            		def.resolve(userInfo);
            		} else {
            			def.reject({ err: 401, message: "not authorized" });
            		}
                }, 100);
            } else {
            	def.resolve(userInfo);
            }
            return def.promise;
        };
        return loginService;
    }])

    //
    .factory('agapData', [function() {

    }]);

})();
