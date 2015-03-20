/**
 * Connection Controller
 */
App.controller('ConnectionController', function ($scope) {
    // binding to view
    $scope.config = jf.readFileSync(configFile);
    // Save configure
    $scope.saveConfig = function () {};

    console.log($scope.config);

});