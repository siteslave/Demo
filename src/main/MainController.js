/**
 * Main Controller
 **/
App.controller('MainController', function ($scope, MainService, LxDialogService,
                                           LxNotificationService, $window) {
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

    $scope.doExport = function () {
        //console.log($scope.patient);
        var exportedPath = path.join(appPath, 'exported');
        var exportedFile = path.join(exportedPath, 'accident.txt');
        var header = 'hospcode|vstdate|vsttime|hn|vn|cid|pname|fname|lname|birth|sex|bba|dba|psychic\n';
        fs.writeFileSync(exportedFile, header, {flag: 'w'});

        var tmpData = [];
        var dataToSend = [];

        _.forEach($scope.patient, function (v) {
            if (!v.exported_date) {
                var obj = {};
                obj.hospcode = $window.sessionStorage.getItem('hospcode');
                obj.vstdate = moment(v.vstdate).format('YYYYMMDD');
                obj.vsttime = v.vsttime;
                obj.hn = v.hn;
                obj.vn = v.vn;
                obj.cid = v.cid;
                obj.pname = v.pname;
                obj.fname = v.fname;
                obj.lname = v.lname;
                obj.birth = moment(v.birthday).format('YYYYMMDD');
                obj.sex = v.sex;
                obj.bba = v.bba;
                obj.dba = v.dba;
                obj.psychic = v.psychic;
                obj.updated_at = moment().format('YYYY-MM-DD HH:mm:ss');

                dataToSend.push(obj);
                tmpData.push({vn: obj.vn, exported_date: moment().format('YYYY-MM-DD HH:mm:ss')});

                var data = [obj.hospcode, obj.vstdate, obj.vsttime, obj.hn,
                    obj.vn, obj.cid, obj.pname, obj.fname, obj.lname, obj.birth,
                    obj.sex, obj.bba, obj.dba, obj.psychic
                ].join('|');

                fs.appendFileSync(exportedFile, data + '\n');
            }
        });

        var promise = MainService.sendRecord(dataToSend);
        promise.then(function () {
            MainService.saveLog(tmpData);
        }).then(function () {
            LxNotificationService.success('Success');
            $scope.doGetData();
        }, function (err) {
            LxNotificationService.error('Error');
            console.log(err);
        });

    };

});