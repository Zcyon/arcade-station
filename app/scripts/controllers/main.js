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
    $scope.$on('$routeChangeStart', function () {
      $window.scrollTo(0, 0);
    });
  });
