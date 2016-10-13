'use strict';

/**
 * @ngdoc function
 * @name enigmaApp.controller:NimgameCtrl
 * @description
 * # NimgameCtrl
 * Controller of the enigmaApp
 */
angular.module('enigmaApp')
  .controller('NimgameCtrl', function ($scope, $interval, $timeout) {
    var aveMessages, aveMessagesInterval, aveTurnTimeout, aveTurnTimeoutTime, aveMessageWaitTime, aveMessageIntervalTime, sticksAmount, isYourTurn, playButtonId, pickButtonId, takeInputId;

    $scope.winStreak       = 0;
    $scope.aveTakenMatches = 0;
    $scope.aveIsThinking   = false;
    $scope.gameStatus      = 'pregame';

    playButtonId = '#playButton';
    pickButtonId = '#pickButton';
    takeInputId  = '#takeInput';

    sticksAmount = 11;
    isYourTurn   = true;

    aveMessageIntervalTime = 10000;
    aveMessageWaitTime     = 4000;
    aveTurnTimeoutTime     = 2000;

    aveMessages = [];

    aveMessages['pregame'] = [
      'AVENÍDANO<br>¿Tienes miedo de perder contra la gran mente maestra del Nim?',
      'AVENÍDANO<br>Adelante. Juega. No temas, pequeña cucaracha.',
      'AVENÍDANO<br>El juego es simple y, tu derrota, inevitable.',
      'AVENÍDANO<br>Intenta ganarte la clave, si te crees muy inteligente.',
      'AVENÍDANO<br>Inicia el juego.'
    ];

    aveMessages['game'] = [
      'AVENÍDANO<br>Es tomar un fósforo, no construir un satélite...'
    ];
    aveMessages['postgamewin'] = [
      'AVENÍDANO<br>Me has vencido.'
    ];
    aveMessages['postgamelose'] = [
      'AVENÍDANO<br>Hah, te he derrotado'
    ];

    $scope.getSticks = function getSticks() {
      return Array(sticksAmount);
    };

    function sendAveMessage() {
      let arrayLength, winStreak, gameStatus;
      winStreak  = $scope.winStreak;
      gameStatus = $scope.gameStatus;

      arrayLength = aveMessages[gameStatus].length;
      Materialize.toast(aveMessages[gameStatus][Math.floor(Math.random() * arrayLength)], aveMessageWaitTime);
    }

    function startGame() {
      let $playButton, $pickButton;
      $playButton = $(playButtonId);
      $pickButton = $(pickButtonId);
      $playButton.attr('disabled', true);
      $pickButton.attr('disabled', false);
      $scope.gameStatus = 'game';

      $scope.$apply();
    }

    function endGame() {
      let gameStatus;
      gameStatus = $scope.gameStatus;
      if (isYourTurn === true) {
        gameStatus = 'postgamewin';
      } else {
        gameStatus = 'postgamelose';
      }
      $scope.gameStatus = gameStatus;
      $scope.$apply();
    }

    function take(tk) {
      let $takeInput, $pickButton, takenMatches, gameStatus, aveIsThinking;
      $takeInput   = $(takeInputId);
      $pickButton  = $(pickButtonId);
      $pickButton.attr('disabled', true);
      aveIsThinking = $scope.aveIsThinking;
      tk = parseInt(tk, 10);
      console.log(tk);
      takenMatches = isNaN(tk) ? $takeInput.val() : tk;
      gameStatus   = $scope.gameStatus;

      if (gameStatus !== 'game') {
        return;
      }

      if (takenMatches > sticksAmount) {
        Materialize.toast('AVENÍDANO<br>No seas tonto. No puedes tomar más fósforos de los que hay.', aveMessageWaitTime);
      } else if (takenMatches > 3) {
        Materialize.toast('AVENÍDANO<br>No seas tonto. No puedes tomar más de tres fósforos.', aveMessageWaitTime);
      } else if (takenMatches <= 0) {
        Materialize.toast('AVENÍDANO<br>No seas tonto. Tienes que tomar al menos un fósforo.');
      } else {
        isYourTurn    = !isYourTurn;
        sticksAmount -= takenMatches;
      }

      if (sticksAmount <= 0) {
        endGame();
      } else {
        if (isYourTurn === false) {
          aveIsThinking  = true;
          $scope.aveIsThinking = aveIsThinking;
          aveTurnTimeout = $timeout(aveTurn, aveTurnTimeoutTime);
        }
        $scope.$apply();
      }
    }

    function aveTurn() {
      // console.log('It\'s his turn!');
      let isAveTurn, $pickButton, $takeInput, takenMatches, aveIsThinking;
      $pickButton   = $(pickButtonId);
      $takeInput    = $(takeInputId);
      isAveTurn     = angular.copy(isYourTurn);
      aveIsThinking = $scope.aveIsThinking;
      takenMatches = Math.floor(Math.random() * 2) + 1;

      aveIsThinking = false;
      $scope.aveIsThinking = aveIsThinking;
      take(takenMatches);

      if (isAveTurn === isYourTurn) {
        aveTurn();
      } else {
        $scope.aveTakenMatches = takenMatches;
        $pickButton.attr('disabled', false);
        $takeInput.focus();
        $scope.$apply();
      }
    }

    $(playButtonId).click(startGame);
    $(pickButtonId).click(take);

    $scope.$on('$routeChangeStart', function stop() {
      $interval.cancel(aveMessagesInterval);
    });

    $(document).ready(function init() {
      let $pickButton;
      $pickButton = $(pickButtonId);
      $pickButton.attr('disabled', true);
      aveMessagesInterval = $interval(sendAveMessage, aveMessageIntervalTime);
    });
  });
