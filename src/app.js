/**
 * Application module
 */
var gui = require('nw.gui'),
    win = gui.Window.get(),
    _ = require('lodash'),
    jf = require('jsonfile'),
    fs = require('fs'),
    path = require('path'),
    moment = require('moment');
/********************************************************/
var appPath = gui.App.dataPath;
var configFile = path.join(appPath, 'config.json');
/*********************************************************/

//Check file configure.
fs.access(configFile, fs.W_OK && fs.R_OK, function (err) {
    if (err) {
        var defaultConfig = {
            db: {
                host: '127.0.0.1',
                port: 3306,
                database: 'mydb',
                user: 'dbUser',
                password: 'dbPassword'
            }
        };

        jf.writeFileSync(configFile, defaultConfig);
    }
});

// Main application module
var App = angular.module('App', ['lumx', 'ngRoute', 'ui.map']);
/************************************************************/
/**
 * Application routing
 */
App.config(function ($routeProvider) {

    // Configure routing
    $routeProvider
        .when('/', { // Main.html#/
            templateUrl: '../main/Main.html',
            controller: 'MainController'
        })
        .when('/settings', { // Main.html#/settings
            templateUrl: '../settings/Settings.html',
            controller: 'SettingController'
        })
        .otherwise({ redirectTo: '/' });

});

App.controller('ToolbarController', function ($scope, $window) {
    $scope.hospname = $window.sessionStorage.getItem('hospname');
    $scope.hospcode = $window.sessionStorage.getItem('hospcode');
});