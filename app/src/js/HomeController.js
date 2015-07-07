(function() {
    "use strict";
    angular.module('agapApp')
        .controller('HomeController', ['$scope', function($scope) {
            console.log("HomeController");
            $scope.name="as";
        }]);
})();
