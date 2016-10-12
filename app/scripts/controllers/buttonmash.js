'use strict';

/**
 * @ngdoc function
 * @name enigmaApp.controller:ButtonmashCtrl
 * @description
 * # ButtonmashCtrl
 * Controller of the enigmaApp
 */
angular.module('enigmaApp')
  .controller('ButtonmashCtrl', function ($timeout, $interval, $scope) {
    var inpyMessages, inpyMessageInterval, inpyMessageWaitTime, inpyMessageIntervalTime, gameStatus, inpyMessageBleep, playButtonId, inpyInputId, inpyEatIntervalTime, inpyEatInterval, inpyEatSpeed, timeIntervalTime, timeInterval, inpyHealth, inpyMAX_HEALTH, inpyHealthBarId, previousChar, inpyDieBleep;

// HTML stuff
    playButtonId    = '#playButton';
    inpyInputId     = '#inpyInput';
    inpyHealthBarId = '#inpyHealthBar';

// Audio stuff
    inpyMessageBleep     = new Audio();
    inpyMessageBleep.src = 'sounds/bleep.mp3';
    inpyDieBleep         = new Audio();
    inpyDieBleep.src     = 'sounds/bleep2.mp3';

// Game stuff
    gameStatus          = 'pregame';
    inpyEatIntervalTime = 100;
    inpyEatSpeed        = 0;
    $scope.time         = 0;
    $scope.inpyIsAlive  = true;
    timeIntervalTime    = 1000;
    inpyMAX_HEALTH      = 400;
    inpyHealth          = inpyMAX_HEALTH;
    previousChar        = undefined;

// Inpy message stuff
    inpyMessages = [];
    inpyMessageIntervalTime = 10000;
    inpyMessageWaitTime     = 4000;

    inpyMessages['pregame'] = [
      'INPY<br>¡Hey! ¡Apresúrate y aliméntame!',
      'INPY<br>¿Quién te crees para ignorarme? ¡Inicia el juego!',
      'INPY<br>¡Tengo hambre! ¡APÚRATE!',
      'INPY<br>¿A qué esperas? ¡TENGO HAMBRE!',
      'INPY<br>Eres la peor sirvienta que he contratado...',
      'INPY<br>Estoy a punto de rebajar 10 pixeles porque no me alimentas',
      'INPY<br>¿Sabes? Estoy muriendo de desnutrición virtual'
    ];

    inpyMessages['game'] = [
      'INPY<br>Si me dejas morir, no tendrás la clave... ¡No señor!',
      'INPY<br>¡ESO! ¡COMIDA! ¡COMIDA! ¡COMIDA!',
      'INPY<br>¡NO DEJES DE DARLE A LOS BOTONES!',
      'INPY<br>*MUNCH* *MUNCH* *MUNCH*'
    ];

    inpyMessages['postgame'] = [
      'INPY<br>Me dejaste morir... x_x',
      'INPY<br>*MUERTO*',
      'INPY<br>... Más muerto que muertín',
      'INPY<br>IM DED :-('
    ];

    function sendInpyMessage() {
      Materialize.toast(inpyMessages[gameStatus][Math.floor(Math.random() * 3)], inpyMessageWaitTime);
      inpyMessageBleep.play();
    }

    function countSeconds() {
      let time;
      time = $scope.time;
      time++;

//    Difficulty handling
      if (time > 10 && time < 30) {
        inpyEatSpeed = 30;
      } else if (time >= 30 && time < 50) {
        inpyEatSpeed = 40;
      } else if (time >= 50 && time < 70) {
        inpyEatSpeed = 60;
      } else if (time >= 70 && time < 90) {
        inpyEatSpeed = 75;
      } else if (time >= 90) {
        inpyEatSpeed = 80;
      }


      $scope.time = time;
    }

    function renderHealth() {
      let $inpyHealthBar, actualHealth;
      $inpyHealthBar = $(inpyHealthBarId);

      actualHealth = (inpyHealth * 100)/inpyMAX_HEALTH;

      $inpyHealthBar.css('width', actualHealth + '%');
    }

    function reboot() {
      inpyHealth   = inpyMAX_HEALTH;
      inpyEatSpeed = 0;
      $scope.time  = 0;
      $scope.inpyIsAlive = true;
      previousChar = undefined;
      timeInterval = undefined;
      $scope.$apply();
    }

    function endGame() {
      let $playButton, $inpyInput;
      $inpyInput = $(inpyInputId);
      $inpyInput.attr('disabled', true);
      $playButton = $(playButtonId);
      $playButton.html('REINICIAR JUEGO');
      $interval.cancel(timeInterval);
      gameStatus = 'postgame';
      $scope.inpyIsAlive = false;
      inpyDieBleep.play();

      if (time > 90) {
        Materialize.toast('INPY<br>Bien, bien, bien... Me mantuviste vivo durante más de 90 segundos. Aquí tienes tu código: 44558787981015');
      }
    }

    function hurt(damage) {
      inpyHealth -= damage;

      if (inpyHealth <= 0) {
        endGame();
      }
    }

    function eat() {
      let $inpyInput, inpyBuffer, actualChar;
      $inpyInput = $(inpyInputId);
      inpyBuffer = $inpyInput.val();

      if (inpyBuffer.length > 0) {
        actualChar = inpyBuffer.substr(0, 1);
        inpyBuffer = inpyBuffer.substr(1, inpyBuffer.length);

        if (previousChar === actualChar) {
          hurt(2);
        }

        previousChar = actualChar;
        $inpyInput.val(inpyBuffer);
      } else {
        // Consume health
        hurt(1);
        renderHealth();
      }

      if (gameStatus === 'game') {
        $timeout(eat, inpyEatIntervalTime - inpyEatSpeed);
      }
    }

    function startGame() {
      let $inpyInput;
      $inpyInput = $(inpyInputId);
      $inpyInput.attr('disabled', false);
      reboot();
      gameStatus = 'game';
      timeInterval = $interval(countSeconds, timeIntervalTime);
      $timeout(eat, inpyEatIntervalTime - inpyEatSpeed);
      $inpyInput.focus();
    }

    $(playButtonId).click(startGame);

    $scope.$on('$routeChangeStart', function stop() {
      $interval.cancel(timeInterval);
      $interval.cancel(inpyMessageInterval);
    });


    $(document).ready(function init() {
      let $inpyInput;
      $inpyInput = $(inpyInputId);
      $inpyInput.attr('disabled', true);
      inpyMessageInterval = $interval(sendInpyMessage, inpyMessageIntervalTime);
    });

  });
