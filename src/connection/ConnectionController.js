/**
 * Connection Controller
 */
App.controller('ConnectionController', function ($scope, LxNotificationService) {

    $scope.config = jf.readFileSync(configFile);

    $scope.save = function () {
        jf.writeFileSync(configFile, $scope.config);
        LxNotificationService.success('บันทึกเสร็จแล้ว');
    };

});