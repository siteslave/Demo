App.controller('LoginController', function ($scope, $window, LoginService, LxNotificationService) {

    $scope.login = function () {
        LoginService.login($scope.username, $scope.password)
            .then(function (rows) {
                if (_.size(rows)) {

                    LoginService.getHospital()
                        .then(function (hosp) {
                            // set session
                            $window.sessionStorage.setItem('username', $scope.username);
                            $window.sessionStorage.setItem('fullname', rows[0].fullname);
                            $window.sessionStorage.setItem('hospcode', hosp.hospitalcode);
                            $window.sessionStorage.setItem('hospname', hosp.hospitalname);

                            $window.location.href = '../pages/Main.html';
                        });
                } else {
                    LxNotificationService.error('ชื่อผู้ใช้งาน หรือ รหัสผ่านไม่ถูกต้อง');
                }
            }, function (err) {
                console.log(err);
            });
    };
});