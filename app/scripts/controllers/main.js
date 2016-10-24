'use strict';

/**
 * @ngdoc function
 * @name enigmaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the enigmaApp
 */
angular.module('enigmaApp')
  .controller('MainCtrl', function ($scope, $window) {
    $scope.games = [{
      name: '¡Alimenta al Input!',
      des: '¡Un juego sobre destrozar tu teclado en un frenesí de botones!',
      thumbnail: 'images/btnmasher.jpg',
      address: '#buttonmash'
    }, {
      name: 'Juego de Nim (Lite)',
      des: 'Un juego de estrategia donde deberás dejar que tu oponente recoja el último fósforo.',
      thumbnail: 'images/nimgame.jpg',
      address: '#nimgame'
    }, {
      name: 'Jukebox',
      des: 'Un videojuego donde deberás memorizar y repetir un patrón musical para progresar.',
      thumbnail: 'images/songoftime.png',
      address: '#jukebox'
    }];


    $scope.$on('$routeChangeStart', function () {
      $window.scrollTo(0, 0);
    });
  });
