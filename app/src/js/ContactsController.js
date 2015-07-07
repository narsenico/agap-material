(function() {
    "use strict";
    angular.module('agapApp')
        .controller('ContactsController', ['$scope', '$q', function($scope, $q) {
            var self = this;
            console.log("ContactsController");

            self.contacts = [];

            self.searchFunc = function(query) {
                var deferred = $q.defer();
                setTimeout(function() {
                	var data = [];
                	angular.forEach(query.split(""), function(el) {
                		this.push( { name: el } );
                	}, data);

                    deferred.resolve(data);
                }, 400);
                return deferred.promise;
            };

            self.searchCallback = function(results) {
                console.log("search ", this, $scope.search, " -> ", results);
                self.contacts = results;
            };
        }]);
})();
