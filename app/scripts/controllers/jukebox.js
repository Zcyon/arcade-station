'use strict';

/**
 * @ngdoc function
 * @name enigmaApp.controller:JukeboxCtrl
 * @description
 * # JukeboxCtrl
 * Controller of the enigmaApp
 */
angular.module('enigmaApp')
  .controller('JukeboxCtrl', function ($scope, $rootScope, $timeout, $interval) {
    var cdown, cup, a, cleft, cright, songs, yourNotes, MAX_NOTE_ARRAY, playingNote, actualSong, songNotes, gameStatus, playButtonId, playedSongs, isYourTurn, messages, messageWaitTime, linkMessageInterval, linkMessageIntervalTime, MAX_WIN_STREAK;

    playButtonId = '#playButton';

    $scope.songTitle     = 'No Song';
    $scope.yourSongTitle = '';
    $scope.linkNotes     = [];
    $scope.yourNotes     = [];
    $scope.winStreak     = 0;


    isYourTurn              = false;
    actualSong              = 0;
    MAX_WIN_STREAK          = 7;
    MAX_NOTE_ARRAY          = 13;
    messageWaitTime         = 4000;
    linkMessageIntervalTime = 10000;
    playingNote             = undefined;
    songs                   = [];
    playedSongs             = [];
    gameStatus              = 'pregame';
    messages                = [];

    messages['encore'] = [
      '¡HEY! ¡MUY BIEN!',
      '¡ASÍ SE TOCA!',
      '¡EXCELENTE!',
      '¡BUENA MEMORIA!',
      '¡BUEN RITMO!'
    ];

    messages['postgamelose'] = [
      'LINK<br>Bueno, un error lo comete cualquiera',
      'LINK<br>Te has equivocado. Prueba a jugar de nuevo.',
      'LINK<br>Adiós a la racha de aciertos...'
    ];

    messages['postgamewin'] = [
      'LINK<br>¡Tienes estilo! Aquí tienes la clave: 03948394843011'
    ];

    messages['pregame'] = [
      'LINK<br>Vamos a tocar un par de canciones',
      'LINK<br>Ah, estás de vuelta, toquemos una gran canción',
      'LINK<br>Necesito un acompañante para tocar, ¿te animas?'
    ];

    messages['celebration'] = [
      'LINK<br>¡BIEN HECHO!',
      'LINK<br>¡Excelente ritmo!'
    ];
    
    // Game stuff
    var Note = function(name, sound, icon) {
      // Name config stuff
      this.name  = name;
      // Sound config stuff
      this.sound     = new Audio();
      this.sound.src = sound;
      // Image config stuff
      this.ico = icon;

      // Sound methods
      this.playSound = function playSound() {
        // console.log('Playing sound');
        this.pauseSound();
        this.sound.play();
      }

      this.pauseSound = function pauseSound() {
        this.sound.pause();
        this.sound.currentTime = 0;
      }

      this.getSoundDuration = function getSoundDuration() {
        return this.sound.length;
      }

      // Icon methods
      this.getIconSource = function getIconSource() {
        return this.ico;
      }
    }

    var Song = function(name, notes, songURL) {
      this.name       = name;
      this.notes      = notes;
      this.actualNote = -1;
      this.MAX_NOTES  = notes.length;
      this.song       = new Audio();
      this.song.src   = songURL;

      // Note methods
      this.getNextNote = function getNextNote() {
        this.actualNote++;
        if (this.actualNote >= this.MAX_NOTES) {
          this.actualNote = 0;
        }
        return this.notes[this.actualNote];
      }

      this.getNotes = function getNotes() {
        return this.notes;
      }

      // Song methods
      this.getSongLength = function getSongLength() {
        return this.MAX_NOTES;
      }

      this.getSongName = function getSongName() {
        return this.name;
      }

      this.playSong = function playSong() {
        this.stopSong();
        this.song.play();
      }

      this.stopSong = function stopSong() {
        this.song.pause();
        this.song.currentTime = 0;
      }

      this.getSongDuration = function getSongDuration() {
        return this.song.duration * 1000;
      }

    }

    function sendLinkMessage() {
      var arrayLength = messages[gameStatus].length;

      if (gameStatus === 'postgamewin') {
        Materialize.toast(messages[gameStatus][Math.floor(Math.random() * arrayLength)]);
      } else {
        Materialize.toast(messages[gameStatus][Math.floor(Math.random() * arrayLength)], messageWaitTime);
      }
      // inpyMessageBleep.play();
    }

    function keyPressed(event, e) {
      var arrayLength;

      if (gameStatus !== 'game' || !isYourTurn) {
        return;
      }

      if (playingNote) {
        // console.log(playingNote);
        playingNote.pauseSound();
      }

      switch (e.which) {
        // W key, binded to CUP
        case 119:
        case 87:
          playingNote = cup;
          break;
        // D key, binded to CRIGHT
        case 100:
        case 68:
          playingNote = cright;
          break;
        // A key, binded to CLEFT
        case 97:
        case 65:
          playingNote = cleft;
          break;
        // S key, binded to CDOWN
        case 115:
        case 83:
          playingNote = cdown;
          break;
        // X key, binded to A
        case 120:
        case 88:
          playingNote = a;
          break;
        // No valid key was pressed
        default:
          return;
      }

      // playingNote.currentTime = 0;
      playingNote.playSound();
      $scope.yourNotes.push(playingNote);

      if ($scope.yourNotes[$scope.yourNotes.length - 1] !== songs[actualSong].getNotes()[$scope.yourNotes.length - 1]) {
        $scope.yourSongTitle = 'Te equivocaste';
        gameStatus = 'postgamelose';
        sendLinkMessage();
        endGame();
      } else if ($scope.yourNotes.length === songs[actualSong].getSongLength()) {
        songs[actualSong].playSong();
        gameStatus = 'celebration';

        $scope.yourSongTitle = songs[actualSong].getSongName();
        $scope.winStreak++;

        if ($scope.winStreak >= MAX_WIN_STREAK) {
          gameStatus = 'postgamewin';
          $timeout(endGame, songs[actualSong].getSongDuration() + 500);
        } else {
          $timeout(encore, songs[actualSong].getSongDuration() + 500);
        }

        sendLinkMessage();
        // console.log(songs[actualSong].getSongDuration());
      } 

      // Note splicing for interface
      arrayLength = $scope.yourNotes.length;
      if (arrayLength >= MAX_NOTE_ARRAY) {
        $scope.yourNotes.splice(0, 1);
      }
      // console.log(e.which);
      $scope.$apply();
    }

    function encore() {
      gameStatus           = 'game';
      $scope.yourSongTitle = '';
      changeTurn();
      startGame();
    }

    function playSong() {
      var songHasBeenPlayed, songDelay;

      do {
        songHasBeenPlayed = false;
        actualSong = Math.floor(Math.random() * songs.length);

        playedSongs.forEach(function playedSongsForEach(playedSongId) {
          if (playedSongId === actualSong) {
            songHasBeenPlayed = true;
          }
        });
      } while (songHasBeenPlayed);

      playedSongs.push(actualSong);
      songNotes = songs[actualSong].getNotes();

      // Note reboot
      $scope.yourNotes = [];
      $scope.linkNotes = [];

      $scope.songTitle = songs[actualSong].getSongName();

      for (var i = 0; i < songs[actualSong].getSongLength(); i++) {
        $timeout(function playNoteTimeout() {
          var note = songs[actualSong].getNextNote();
          note.playSound();
          $scope.linkNotes.push(note);
        }, 1100 * i);
      }

      songDelay = 1200 * songs[actualSong].getSongLength();

      return songDelay;
    }

    function reboot() {
      $scope.songTitle     = 'No Song';
      $scope.yourSongTitle = '';
      $scope.linkNotes     = [];
      $scope.yourNotes     = [];
      $scope.winStreak     = 0;

      isYourTurn  = false;
      playedSongs = [];


      $scope.$apply();
    }

    function startGame() {
      var $playButton;
      $playButton = $(playButtonId);
      $playButton.attr('disabled', true);
      gameStatus = 'game';
      $timeout(changeTurn, playSong());
      $interval.cancel(linkMessageInterval);
    }

    function endGame() {
      var $playButton;
      $playButton = $(playButtonId);
      $playButton.attr('disabled', false);
      $playButton.html('reiniciar juego');
      reboot();
      gameStatus = 'pregame';
      linkMessageInterval = $interval(sendLinkMessage, linkMessageIntervalTime);
    }

    function changeTurn() {
      isYourTurn = !isYourTurn;
    }

    $scope.getTurnInfo = function getTurnInfo() {
      return isYourTurn;
    };

    // Event binding
    $scope.$on('keypress', keyPressed);
    $(playButtonId).click(startGame);
    $scope.$on('$routeChangeStart', function stop() {
      $interval.cancel(linkMessageInterval);
      songs[actualSong].stopSong();
    });

    $(document).ready(function init() {
      // Note configuration
      a          = new Note('a', 'sounds/dmed.wav', 'images/abutton.png');
      cup        = new Note('cup', 'sounds/d2med.wav', 'images/cbuttonup.png');
      cleft      = new Note('cleft', 'sounds/bmed.wav', 'images/cbuttonleft.png');
      cdown      = new Note('cdown', 'sounds/fmed.wav', 'images/cbuttondown.png');
      cright     = new Note('cright', 'sounds/amed.wav', 'images/cbuttonright.png');

      // For debugging purposes
      // actualSong = 5;

      // Song configuration
      songs[0]  = new Song('Song of Time', [cright, a, cdown, cright, a, cdown], './sounds/songoftime.mp3');
      songs[1]  = new Song('Saria\'s Song', [cdown, cright, cleft, cdown, cright, cleft], './sounds/sariassong.mp3');
      songs[2]  = new Song('Bolero of Fire', [cdown, a, cdown, a, cright, cdown, cright, cdown], './sounds/bolerooffire.mp3');
      songs[3]  = new Song('Prelude of Light', [cup, cright, cup, cright, cleft, cup], './sounds/preludeoflight.mp3');
      songs[4]  = new Song('Minuet of Forest', [a, cup, cleft, cright, cleft, cright], './sounds/minuetofforest.mp3');
      songs[5]  = new Song('Nocturne of Shadow', [cleft, cright, cright, a, cleft, cright, cdown], './sounds/nocturneofshadow.mp3');
      songs[6]  = new Song('Requiem of Spirit', [a, cdown, a, cright, cdown, a], './sounds/requiemofspirit.mp3');
      songs[7]  = new Song('Serenade of Water', [a, cdown, cright, cright, cleft], './sounds/serenadeofwater.mp3');
      songs[8]  = new Song('Song of Storms', [a, cdown, cup, a, cdown, cup], './sounds/songofstorms.mp3');
      songs[9]  = new Song('Sun\'s Song', [cright, cdown, cup, cright, cdown, cup], './sounds/sunsong.mp3');
      songs[10] = new Song('Epona\'s Song', [cup, cleft, cright, cup, cleft, cright], './sounds/eponasong.mp3');
      songs[11] = new Song('Zelda\'s Lullaby', [cleft, cup, cright, cleft, cup, cright], './sounds/zeldalullaby.mp3');

      // playSong();
      linkMessageInterval = $interval(sendLinkMessage, linkMessageIntervalTime);
    });
  });
