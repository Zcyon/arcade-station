'use strict';

/**
 * @ngdoc function
 * @name enigmaApp.controller:CryptographCtrl
 * @description
 * # CryptographCtrl
 * Controller of the enigmaApp
 */
angular.module('enigmaApp')
  .controller('CryptographCtrl', function () {
    var passwordInputId, encryptedTextareaId, decryptedTextareaId, decodeButtonId;

    passwordInputId      = '#passwordInput';
    encryptedTextareaId  = '#encryptedTextarea';
    decryptedTextareaId  = '#decryptedTextarea';
    decodeButtonId       = '#decodeButton';

    function xorEncode(txt, pass) {
      var z;
      var ord = [];
      var buf = "";
  
      //for (var z = 1; z <= 255; z++) {ord[String.fromCharCode(z)] = z}
  
      for (var j = z = 0; z < txt.length; z++) {
          buf += String.fromCharCode(txt.charCodeAt(z) ^ pass.charCodeAt(j));
          j = (j < pass.length) ? j + 1 : 0
      }
  
      return buf;
 
    }

    function decode() {
      let $passwordInput, $encryptedTextarea, $decryptedTextarea;
      $passwordInput      = $(passwordInputId);
      $encryptedTextarea  = $(encryptedTextareaId);
      $decryptedTextarea = $(decryptedTextareaId);
      console.log(xorEncode($encryptedTextarea.val(), $passwordInput.val()));
      $decryptedTextarea.val(xorEncode($encryptedTextarea.val(), $passwordInput.val()));
      $decryptedTextarea.focus();
    }

    $(decodeButtonId).click(decode);

    $(document).ready(function init() {
      let txt = 'Hi, how are you?';
      let pass = 'aws';
      let encoded = xorEncode(txt, pass);
      console.log('Encoded string: ', encoded);
      console.log('Decoded string: ', xorEncode(encoded, pass));
    });
  });
