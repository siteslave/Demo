/**
 * Setting Controller
 */
App.controller('SettingController', function ($scope) {
    // binding to view
    $scope.config = jf.readFileSync(configFile);
    // Save configure
    $scope.saveConfig = function () {};
    
});