/**
 * Application module
 */
// Main application module
var App = angular.module('App', ['lumx', 'ngRoute']);
// API url
var apiUrl = 'http://localhost:3000';
// App configuration
App.config(function ($routeProvider) {

    // Configure routing
    $routeProvider
        .when('/', {
            templateUrl: 'partials/Main.html',
            controller: 'MainController'
        })
        .when('/settings', {
            templateUrl: 'partials/Settings.html',
            controller: 'SettingController'
        })
        .otherwise({ redirectTo: '/' });
});