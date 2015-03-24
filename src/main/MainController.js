/**
 * Main Controller
 **/
App.controller('MainController', function ($scope, MainService, LxDialogService, LxNotificationService) {
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
        $scope.vn = vn;
        LxDialogService.open('mdlMap');
    };

    // map setting
    $scope.mapOptions = {
        center: new google.maps.LatLng(16.0518252, 103.6536376),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };

    $scope.markers = [];

    $scope.addMarker = function (event, params) {
        //console.log(params[0].latLng);
        $scope.lat = params[0].latLng.k;
        $scope.lng = params[0].latLng.D;

        // clear map
        $scope.clearMarker();
        // set marker
        $scope.markers.push(new google.maps.Marker({
            map: $scope.myMap,
            position: params[0].latLng
        }));
    };

    $scope.doClearMarker = function (map) {
        for (var i = 0; i < $scope.markers.length; i++) {
            $scope.markers[i].setMap(map);
        }
    };

    $scope.clearMarker = function () {
        $scope.doClearMarker(null);
    };

    // clear form
    $scope.closingModal = function () {
        $scope.clearMarker();
        $scope.lat = null;
        $scope.lng = null;
        $scope.vn = null;
    };

    $scope.saveMap = function () {

        MainService.saveMap($scope.vn, $scope.lat, $scope.lng)
            .then(function () {
                LxNotificationService.success('บันทึกเสร็จเรียบร้อย');
                LxDialogService.close('mdlMap');
            }, function (err) {
                console.log(err);
                LxNotificationService.error('Error');
            });

    };

});