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
    var aveMessages, aveMessagesInterval, aveTurnTimeout, aveTurnTimeoutTime, aveMessageWaitTime, aveMessageIntervalTime, sticksAmount, isYourTurn, playButtonId, pickButtonId, takeInputId, aveLaugh, MAX_STICK_AMOUNT, MAX_STREAK;

    MAX_STREAK             = 5;
    $scope.winStreak       = 0;
    $scope.aveTakenMatches = 0;
    $scope.aveIsThinking   = false;
    $scope.gameStatus      = 'pregame';

    aveLaugh     = new Audio();
    aveLaugh.src = 'sounds/laugh2.mp3';

    playButtonId = '#playButton';
    pickButtonId = '#pickButton';
    takeInputId  = '#takeInput';

    MAX_STICK_AMOUNT = 11;
    sticksAmount     = MAX_STICK_AMOUNT;
    isYourTurn       = true;

    aveMessageIntervalTime = 10000;
    aveMessageWaitTime     = 4000;
    aveTurnTimeoutTime     = 2000;

    aveMessages = [];

    aveMessages['pregame'] = [
      'AVENÍDANO<br>¡ERES TAN TONTO! ¡JAMÁS PODRÁS VENCERME, N00B!',
      'AVENÍDANO<br>¡TE PARTÍ ESAJ NALGAS!',
      'AVENÍDANO<br>GG IZI!',
      'AVENÍDANO<br>¡TE COGÍÍÍÍ! ¡POR MAMAHUEVO!',
      'AVENÍDANO<br>¡TOOOOOOOOOOOOOOOOOOOMAAAAAAAAAAAAAAAAAAAAAA!',
      'AVENÍDANO<br>¿Tienes miedo de perder contra la gran mente maestra del Nim?',
      'AVENÍDANO<br>Adelante. Juega. No temas, pequeña cucaracha.',
      'AVENÍDANO<br>El juego es simple y, tu derrota, inevitable.',
      'AVENÍDANO<br>Intenta ganarte la clave, si te crees muy inteligente.',
      'AVENÍDANO<br>Inicia el juego.',
      'AVENÍDANO<br>¡MALDICIÓN! ¡NO! ¡LAG! ¡REVANCHA!',
      'AVENÍDANO<br>¡MALDITO CANTV Y MALDITO PAÍS DE MIERDA! ¡PUTO LAG!',
      'AVENÍDANO<br>¡COOOOOOOOOOOOOOOOOOOOÑOOOOOOOOOOOOOOOOOOOOOO!',
      'AVENÍDANO<br>¡PUTA MIERDA! ¡OTRA!',
      'AVENÍDANO<br>¡NO! ¡ME VOY AFK! ¡SURRENDER!'
    ];

    aveMessages['game'] = [
      'AVENÍDANO<br>Va, pues, te dejo jugar.',
      'AVENÍDANO<br>Dale, farmea, a ver si me alcanzas.',
      'AVENÍDANO<br>¡¡TE ESTOY LO QUE SE DICE ES PARTIENDO!!',
      'AVENÍDANO<br>¡¡AGARRA PUES, 1 vs 1!!',
      'AVENÍDANO<br>¡¿NO QUE ME IBAS A PARTIR EN 2?!',
      'AVENÍDANO<br>Es tomar un fósforo, no construir un satélite...',
      'AVENÍDANO<br>Sólo toma 1, 2 o tres fósforos, no tienes que pensar tanto',
      'AVENÍDANO<br>Anda. Juega.',
      'AVENÍDANO<br>¿Te fuiste AFK? Agarra pues.',
      'AVENÍDANO<br>Me toma exactamente dos segundos decidir cuántos fósforos tomar, ¿por qué a ti te toma tanto tiempo?',
      'AVENÍDANO<br>¡AGARRA RÁPIDO, PUES! ¡NOJODA!',
      'AVENÍDANO<br>¿QUÉ ES ESTA VERGA? ¡¿700 DE PING?!',
      'AVENÍDANO<br>¡¡RÁÁÁÁPIDOOOOOOOOOOOOOOOOOOOOOOOOOO!!',
      'AVENÍDANO<br>¡DALE, PUES! ¡VERGACIÓN! ¡ESTA VEZ TE VOY A PARTIR!',
      'AVENÍDANO<br>¡AHORA SÍ! ¡ME COMPRÉ UN MOUSE NUEVO!' 
    ];
    aveMessages['postgamewin'] = [
      'AVENÍDANO<br>Me has vencido.',
      'AVENÍDANO<br>Me has vencido.',
      'AVENÍDANO<br>Me has vencido.',
      'AVENÍDANO<br>Me has vencido.',
      'AVENÍDANO<br>Me has vencido.',
      'AVENÍDANO<br>Me has vencido.',
      'AVENÍDANO<br>Me has vencido.',
      'AVENÍDANO<br>Me has vencido.',
      'AVENÍDANO<br>Me has vencido.',
      'AVENÍDANO<br>Me has vencido.',
      'AVENÍDANO<br>¡MALDICIÓN! ¡NO! ¡LAG! ¡REVANCHA!',
      'AVENÍDANO<br>¡MALDITO CANTV Y MALDITO PAÍS DE MIERDA! ¡PUTO LAG!',
      'AVENÍDANO<br>¡COOOOOOOOOOOOOOOOOOOOÑOOOOOOOOOOOOOOOOOOOOOO!',
      'AVENÍDANO<br>¡PUTA MIERDA! ¡OTRA!',
      'AVENÍDANO<br>¡NO! ¡ME VOY AFK! ¡SURRENDER!'
    ];
    aveMessages['postgamelose'] = [
      'AVENÍDANO<br>¡ERES TAN TONTO! ¡JAMÁS PODRÁS VENCERME, N00B!',
      'AVENÍDANO<br>¡TE PARTÍ ESAJ NALGAS! ¡¿NO QUE MUY MACHO?!',
      'AVENÍDANO<br>GG IZI!',
      'AVENÍDANO<br>¡TE COGÍÍÍÍ! ¡POR MAMAHUEVO!',
      'AVENÍDANO<br>¡TOOOOOOOOOOOOOOOOOOOMAAAAAAAAAAAAAAAAAAAAAA!',
      'AVENÍDANO<br>Hah, te he derrotado',
      'AVENÍDANO<br>Hah, te he derrotado',
      'AVENÍDANO<br>Hah, te he derrotado',
      'AVENÍDANO<br>Hah, te he derrotado',
      'AVENÍDANO<br>Hah, te he derrotado',
      'AVENÍDANO<br>Hah, te he derrotado',
      'AVENÍDANO<br>Hah, te he derrotado',
      'AVENÍDANO<br>Hah, te he derrotado',
      'AVENÍDANO<br>Hah, te he derrotado',
      'AVENÍDANO<br>Hah, te he derrotado',
    ];

    $scope.getSticks = function getSticks() {
      return Array(sticksAmount);
    };

    function reboot() {
        sticksAmount = MAX_STICK_AMOUNT;
        isYourTurn   = true;
    }

    function sendAveMessage() {
      let arrayLength, winStreak, gameStatus;
      winStreak  = $scope.winStreak;
      gameStatus = $scope.gameStatus;


      if (isYourTurn === false) {
        return;
      }

      if (winStreak >= MAX_STREAK) {
        winStreak = MAX_STREAK;
      } else if (winStreak <= (-1)*MAX_STREAK) {
        winStreak = (-1)*MAX_STREAK;
      }

      arrayLength = aveMessages[gameStatus].length;
      Materialize.toast(aveMessages[gameStatus][Math.floor(Math.random() * MAX_STREAK) + MAX_STREAK + winStreak], aveMessageWaitTime);
      aveLaugh.play();
    }

    function startGame() {
      let $playButton, $pickButton;
      $playButton = $(playButtonId);
      $pickButton = $(pickButtonId);
      $playButton.attr('disabled', true);
      $pickButton.attr('disabled', false);
      $scope.gameStatus = 'game';
      reboot();

      $scope.$apply();
    }

    function endGame() {
      let gameStatus, $playButton, $pickButton, winStreak;
      winStreak   = $scope.winStreak;
      $playButton = $(playButtonId);
      $pickButton = $(pickButtonId);
      gameStatus  = $scope.gameStatus;

      // Winner determination
      if (isYourTurn === true) {
        winStreak++;
        if (winStreak >= MAX_STREAK) {
          Materialize.toast('AVENÍDANO<br>¡NO! ¡TRAMPA! ¡LAG! ¡PHP! ¡PDF! ¡JAMÁS TE VOY A DECIR LA CLAVE! ¡¡JAMÁS!! ¡ASÍ ME GANES 1000000 DE VECES! ¡NOOOOOOOOOOOOOOOOOOOOOOOOOOOOO!');
        }
        gameStatus = 'postgamewin';
      } else {
        winStreak--;
        if (winStreak <= (-1)*MAX_STREAK) {
          Materialize.toast('AVENÍDANO<br>¡QUÉ MOLLEJA DE ESTÚPIDO ERES! ¡SI SIGUES ASÍ JAMÁS VAS A SABER QUE LA CLAVE ES 32155464636193! ¡BASURA!');
        }
        gameStatus = 'postgamelose';
      }

      // Interface preparation
      $playButton.attr('disabled', false);
      $playButton.html('reiniciar juego');
      $pickButton.attr('disabled', true);
      $scope.gameStatus = gameStatus;
      $scope.winStreak  = winStreak;
      $scope.$apply();
    }

    function take(tk) {
      let $takeInput, $pickButton, takenMatches, gameStatus, aveIsThinking;
      $takeInput   = $(takeInputId);
      $pickButton  = $(pickButtonId);
      
      aveIsThinking = $scope.aveIsThinking;
      tk = parseInt(tk, 10);
      console.log(tk);
      takenMatches = isNaN(tk) ? $takeInput.val() : tk;
      gameStatus   = $scope.gameStatus;

      if (gameStatus !== 'game') {
        return;
      }

      if (takenMatches > sticksAmount) {
        if (isYourTurn) {
          Materialize.toast('AVENÍDANO<br>No seas tonto. No puedes tomar más fósforos de los que hay.', aveMessageWaitTime);
        }
      } else if (takenMatches > 3) {
        if (isYourTurn) {
          Materialize.toast('AVENÍDANO<br>No seas tonto. No puedes tomar más de tres fósforos.', aveMessageWaitTime);
        }
      } else if (takenMatches <= 0) {
        if (isYourTurn) {
          Materialize.toast('AVENÍDANO<br>No seas tonto. Tienes que tomar al menos un fósforo.');
        }
      } else {
        isYourTurn    = !isYourTurn;
        sticksAmount -= takenMatches;
      }

      if (sticksAmount <= 0) {
        endGame();
      } else {
        if (isYourTurn === false) {
          $pickButton.attr('disabled', true);
          aveIsThinking  = true;
          $scope.aveIsThinking = aveIsThinking;
          aveTurnTimeout = $timeout(aveTurn, aveTurnTimeoutTime);
        } else {
          $pickButton.attr('disabled', false);
        }
        $scope.$apply();
      }
    }

    function aveTurn() {
      // console.log('It\'s his turn!');
      let isAveTurn, $takeInput, takenMatches, aveIsThinking;
      $takeInput    = $(takeInputId);
      isAveTurn     = angular.copy(isYourTurn);
      aveIsThinking = $scope.aveIsThinking;

      if (sticksAmount <= 3 && sticksAmount > 1) {
        takenMatches = sticksAmount - 1;
      } else {
        takenMatches = Math.floor(Math.random() * 2) + 1;
      }

      aveIsThinking = false;
      $scope.aveIsThinking = aveIsThinking;
      take(takenMatches);

      if (isAveTurn === isYourTurn) {
        aveTurn();
      } else {
        $scope.aveTakenMatches = takenMatches;
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
