'use strict';

/**
 * @ngdoc function
 * @name enigmaApp.controller:JukeboxCtrl
 * @description
 * # JukeboxCtrl
 * Controller of the enigmaApp
 */
angular.module('enigmaApp')
  .controller('JukeboxCtrl', function ($scope, $rootScope, $timeout) {
    var cdown, cup, a, cleft, cright, songs, yourNotes, MAX_NOTE_ARRAY, playingNote;

    $scope.songTitle     = 'No Song';
    $scope.yourTurn      = true;
    $scope.linkNotes     = [];
    $scope.yourNotes     = [];
    $scope.winStreak     = 0;


    MAX_NOTE_ARRAY = 13;
    playingNote;
    songs = [];
    
    // Game stuff
    class Note {
      constructor(name, sound, icon) {
        // Name config stuff
        this.name  = name;
        // Sound config stuff
        this.sound     = new Audio();
        this.sound.src = sound;
        // Image config stuff
        this.ico = icon;
      }

      // Sound methods
      playSound() {
        // console.log('Playing sound');
        this.pauseSound();
        this.sound.play();
      }

      pauseSound() {
        this.sound.pause();
        this.sound.currentTime = 0;
      }

      getSoundDuration() {
        return this.sound.length;
      }

      // Icon methods
      getIconSource() {
        return this.ico;
      }
    }

    class Song {
      constructor(name, notes) {
        this.name       = name;
        this.notes      = notes;
        this.actualNote = -1;
        this.MAX_NOTES  = notes.length;
      }

      // Note methods
      getNextNote() {
        this.actualNote++;
        if (this.actualNote >= this.MAX_NOTES) {
          this.actualNote = 0;
        }
        return this.notes[this.actualNote];
      }

      getNotes() {
        return this.notes;
      }

      // Song methods
      getSongLength() {
        return this.MAX_NOTES;
      }

      getSongName() {
        return this.name;
      }

    }

    function keyPressed(event, e) {
      let arrayLength;

      if (playingNote) {
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

      arrayLength = $scope.yourNotes.length;
      if (arrayLength >= MAX_NOTE_ARRAY) {
        $scope.yourNotes.splice(0, 1);
      }
      // console.log(e.which);
      $scope.$apply();
    };

    // Event binding
    $scope.$on('keypress', keyPressed);

    $(document).ready(function init() {
      let songNotes, actualSong;

      // Note configuration
      a          = new Note('a', 'sounds/dmed.wav', 'images/abutton.png');
      cup        = new Note('cup', 'sounds/d2med.wav', 'images/cbuttonup.png');
      cleft      = new Note('cleft', 'sounds/bmed.wav', 'images/cbuttonleft.png');
      cdown      = new Note('cdown', 'sounds/fmed.wav', 'images/cbuttondown.png');
      cright     = new Note('cright', 'sounds/amed.wav', 'images/cbuttonright.png');

      // For debugging purposes
      actualSong = 5;

      // Song configuration
      songs[0]  = new Song('Song of Time', [cright, a, cdown, cright, a, cdown]);
      songs[1]  = new Song('Saria\'s Song', [cdown, cright, cleft, cdown, cright, cleft]);
      songs[2]  = new Song('Bolero of Fire', [cdown, a, cdown, a, cright, cdown, cright, cdown]);
      songs[3]  = new Song('Prelude of Light', [cup, cright, cup, cright, cleft, cup]);
      songs[4]  = new Song('Minuet of Forest', [a, cup, cleft, cright, cleft, cright]);
      songs[5]  = new Song('Nocturne of Shadow', [cleft, cright, cright, a, cleft, cright, cdown]);
      songs[6]  = new Song('Requiem of Spirit', [a, cdown, a, cright, cdown, a]);
      songs[7]  = new Song('Serenade of Water', [a, cdown, cright, cright, cleft]);
      songs[8]  = new Song('Song of Storms', [a, cdown, cup, a, cdown, cup]);
      songs[9]  = new Song('Sun\'s Song', [cright, cdown, cup, cright, cdown, cup]);
      songs[10] = new Song('Epona\'s Song', [cup, cleft, cright, cup, cleft, cright]);
      songs[11] = new Song('Zelda\'s Lullaby', [cleft, cup, cright, cleft, cup, cright]);
 
      songNotes = songs[actualSong].getNotes();

      $scope.songTitle = songs[actualSong].getSongName();

      for (let i = 0; i < songs[actualSong].getSongLength(); i++) {
        $timeout(() => {
          let note = songs[actualSong].getNextNote();
          note.playSound();
          $scope.linkNotes.push(note);
        }, 1100 * i);
      }

    });
  });
