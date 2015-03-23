/**
 * Connection Controller
 */
App.controller('ConnectionController', function ($scope) {

    $scope.config = jf.readFileSync(configFile);

});