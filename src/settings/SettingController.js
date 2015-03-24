/**
 * Setting Controller
 */
App.controller('SettingController', function ($scope, SettingService) {

    $scope.ajax = {
        list: [],
        loading: false,
        search: function (query) {
            // search from db
            SettingService.search(query)
                .then(function (rows) {
                    $scope.ajax.list = rows;
                }, function (err) {
                    console.log(err);
                });
        },
        setData: function (data) {
            //console.log(data);
            $scope.hospitals = data;
        }
    };

    $scope.showSelected = function () {
        console.log($scope.hospitals.hospcode);
        console.log($scope.hospitals.hosptype);
        console.log($scope.hospitals.name);
    };

    $scope.checkStatus = function () {
        console.log($scope.exported);
        var isExported = $scope.exported ? 'Y' : 'N';
        console.log(isExported);
    };
});