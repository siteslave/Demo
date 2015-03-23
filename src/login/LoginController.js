App.controller('LoginController', function ($scope, $window, LoginService, LxNotificationService) {

    $scope.login = function () {
        LoginService.login($scope.username, $scope.password)
            .then(function (rows) {
                if (_.size(rows)) {
                    LxNotificationService.success('ยินดีต้อนรับ ' + rows[0].fullname);
                } else {
                    LxNotificationService.error('ชื่อผู้ใช้งาน หรือ รหัสผ่านไม่ถูกต้อง');
                }
            }, function (err) {
                console.log(err);
            });
    };
});