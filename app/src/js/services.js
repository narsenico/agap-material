(function() {
    "use strict";

    angular.module('agapApp')

    //
    .factory('agapConfig', [function agapConfigProvider() {

        var config = {
            DEBUG: 5,
            INFO: 4,
            WARN: 3,
            ERROR: 2,
            CRITICAL: 1,
            rememberLogin: false,
            lastUser: null,
            lastPassword: null,
            logLevel: 5,
            save: function() {
                localStorage.setItem('agapConfig', JSON.stringify({
                    rememberLogin: this.rememberLogin,
                    lastUser: this.lastUser,
                    lastPassword: this.lastPassword,
                    logLevel: this.logLevel
                }));
            }
        };

        var localCfg = angular.extend(config, JSON.parse(localStorage.getItem('agapConfig')));
        return localCfg;
    }])

    //
    .factory('remoteLog', ['agapConfig', function remoteLogProvider(agapConfig) {
        //TODO log remoto (asincrono, aggiungere i log ad una coda e ogni tanto fare la chiamata remota)
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
    .factory('agapLogin', ['$q', 'remoteLog', function agapLoginProvider($q, remoteLog) {
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
            			def.reject({ errCode: "E001", message: "not authorized" });
            		}
                }, 100);
            } else if (userInfo.isLogged) {
            	def.resolve(userInfo);
            } else {
                def.reject({ errCode: "E002", message: "user not logged" });
            }
            return def.promise;
        };
        return loginService;
    }])

    //
    .factory('agapData', [function agapDataProvider() {
        //TODO
    }])

    //eventi: agapMenuVisible
    //funzioni: showMenu
    .factory('UI', ['$rootScope', function UIProvider($rootScope) {

        function showMenu(showing) {
            $rootScope.$broadcast('agapMenuVisible', showing);
        }

        return {
            showMenu: showMenu
        };
    }])
    ;

})();
