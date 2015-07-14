(function() {
    "use strict";

    angular
        .module('agapApp', ['ngRoute', 'ngMaterial', 'ngMessages'])

    .config(['$routeProvider', '$mdThemingProvider', '$mdIconProvider',
        function agapConfig($routeProvider, $mdThemingProvider, $mdIconProvider) {

            //icons configuration
            $mdIconProvider
                .icon("home", "./assets/svg/home.svg", 24)
                .icon("menu", "./assets/svg/menu.svg", 24)
                .icon("logout", "./assets/svg/logout.svg", 24)
                .icon("contacts", "./assets/svg/account.svg", 24)
                .icon("calendar", "./assets/svg/calendar-clock.svg", 24)
                .icon("contacts-add", "./assets/svg/account-plus.svg", 24);

            //theme configuration
            $mdThemingProvider.theme('default')
                //vedi http://www.google.com/design/spec/style/color.html#color-color-palette
                .primaryPalette('teal')
                .accentPalette('pink')
                .warnPalette('red');
            $mdThemingProvider.theme('docs-dark', 'default')
                .primaryPalette('yellow')
                .dark();

            //
            $routeProvider
                .when('/home', {
                    templateUrl: './src/views/home.html'
                })
                .when('/contacts', {
                    templateUrl: './src/views/contacts.html'
                })
                .when('/calendar', {
                    templateUrl: './src/views/calendar.html'
                })
                .when('/login', {
                    templateUrl: './src/views/login.html',
                    isAccessFree: true
                })
                .when('/logout', {
                    redirectTo: '/login'
                });

            //TODO caricare i moduli AGAP_MODULES
            for (var agapModuleName in AGAP_MODULES) {
                var agapModule = AGAP_MODULES[agapModuleName];
                console.log('module', agapModuleName, '->', agapModule.route, 'enabled', !!agapModule.enabled);
                if (agapModule.enabled === false) continue;
                $routeProvider.when(agapModule.route, {
                    templateUrl: './src/modules/' + agapModule.mainTemplateUrl
                });
            }

            $routeProvider.otherwise({
                redirectTo: '/home'
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

    .run(['$rootScope', '$location', 'agapConfig', 'remoteLog', 'agapLogin', 'UI',
        function agapRun($rootScope, $location, agapConfig, remoteLog, agapLogin, UI) {
            agapConfig.logLevel = agapConfig.DEBUG;
            agapConfig.save();

            function checkSecurity(route, auth) {
                //TODO controllare sicurezza: l'utente può accedere alla route?
                //  if (not auth) { redirect }
                //else
                UI.showMenu(true);
            }

            //registro l'evento al cambiamento della route
            //  se l'utente non è loggato e l'accesso alla route non è libero (isAccessFree)
            //  blocco la richiesta e reindirizzo a /login
            $rootScope.$on('$routeChangeStart', function(evt, next, current) {
                remoteLog.log('route changing', next.templateUrl, ' isAccessFree ', next.isAccessFree);
                if (!next.isAccessFree) {
                    agapLogin().then(
                        function(auth) {
                            //contorllo le autorizzazioni autorizzazioni
                            checkSecurity(next, auth);
                        },
                        function(err) {
                            //login automatico
                            if (err.errCode == "E002" && agapConfig.rememberLogin) {
                                remoteLog.log('user not logged, try automatic login');
                                agapLogin(agapConfig.lastUser, agapConfig.lastPassword).then(function(auth) {
                                    //contorllo le autorizzazioni autorizzazioni
                                    checkSecurity(next, auth);
                                }, function(err) {
                                    remoteLog.log('ERR', 'user not logged: redirect to login');
                                    $location.path('/login');
                                });
                            } else {
                                remoteLog.log('ERR', 'user not logged: redirect to login');
                                $location.path('/login');
                            }
                        }
                    );
                }
            });
        }
    ])

    ;

})();
