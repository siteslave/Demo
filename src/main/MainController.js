/**
 * Main Controller
 **/
App.controller('MainController', function ($scope, MainService, LxDialogService) {
    $scope.patient = [];

    $scope.getData = function (startDate, endDate) {
        MainService.getData(startDate, endDate)
            .then(function (rows) {
                $scope.patient = rows;
            }, function (err) {
                console.log(err);
            });
    };

    var startDate = moment().format('YYYY-MM-DD');
    var endDate = moment().format('YYYY-MM-DD');

    $scope.getData(startDate, endDate);

    $scope.doGetData = function () {
        var startDate = moment($scope.startDate).format('YYYY-MM-DD');
        var endDate = moment($scope.endDate).format('YYYY-MM-DD');
        $scope.getData(startDate, endDate);
    };

    $scope.showMap = function (vn) {
        console.log(vn);
        LxDialogService.open('mdlMap');
    };

    // map setting
    $scope.mapOptions = {
        center: new google.maps.LatLng(16.0518252, 103.6536376),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };
});