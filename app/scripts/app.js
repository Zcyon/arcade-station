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
      .when('/buttonmash', {
        templateUrl: 'views/buttonmash.html',
        controller: 'ButtonmashCtrl',
        controllerAs: 'buttonmash'
      })
      .when('/nimgame', {
        templateUrl: 'views/nimgame.html',
        controller: 'NimgameCtrl',
        controllerAs: 'nimgame'
      })
      .when('/jukebox', {
        templateUrl: 'views/jukebox.html',
        controller: 'JukeboxCtrl',
        controllerAs: 'jukebox'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
