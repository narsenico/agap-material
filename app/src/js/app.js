(function() {
    "use strict";

    var DEBUG = true;

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
                    .when('/login', {
                        templateUrl: './src/views/login.html',
                        contoller: 'LoginController',
                        controllerAs: 'loginCtrl',
                        isFree: true
                    })
                    .when('/home', {
                        templateUrl: './src/views/home.html',
                        contoller: 'HomeController',
                        controllerAs: 'homeCtrl'
                    })
                    .when('/contacts', {
                        templateUrl: './src/views/contacts.html',
                        controller: 'ContactsController',
                        controllerAs: 'contactsCtrl'
                    })
                    .when('/calendar', {
                        templateUrl: './src/views/calendar.html',
                        contoller: 'CalendarController',
                        controllerAs: 'calendarCtrls'
                    });
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

    //
    .factory('remoteLog', [function() {
        //TODOD log remoto (asincrono, aggiungere i log ad una coda e ogni tanto fare la chiamata remota)
        return {
            log: function() {
                if (DEBUG) {
                    console.log.apply(console, Array.prototype.slice.apply(arguments));
                }
            }
        };

    }])

    //login service
    //  - (no args): return: user info
    //  - user, password: login, return: user info
    .factory('login', [function($rootScope, remoteLog) {
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

    .run(['$rootScope', '$location', 'remoteLog', 'login', function($rootScope, $location, remoteLog, login) {
        //registro l'evento al cambiamento della route
        //  se l'utente non è loggato e l'accesso alla route non è libero (isFree)
        //  blocco la richiesta e reindirizzo a /login
        $rootScope.$on('$routeChangeStart', function(evt, next, current) {
            remoteLog.log('route changing', next.templateUrl, ' isfree ', next.isFree);
            if (!next.isFree && !login().isLogged) {
                remoteLog.log('ERR', 'user not logged: redirect to login');
                $location.path('/login');
            }
        });
    }])

    ;

})();
