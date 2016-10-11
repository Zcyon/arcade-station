'use strict';

/**
 * @ngdoc overview
 * @name enigmaApp
 * @description
 * # enigmaApp
 *
 * Main module of the application.
 */
angular
  .module('enigmaApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/pong', {
        templateUrl: 'views/pong.html',
        controller: 'PongCtrl',
        controllerAs: 'pong'
      })
      .when('/cryptograph', {
        templateUrl: 'views/cryptograph.html',
        controller: 'CryptographCtrl',
        controllerAs: 'cryptograph'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
