'use strict';

describe('Controller: CryptographCtrl', function () {

  // load the controller's module
  beforeEach(module('enigmaApp'));

  var CryptographCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CryptographCtrl = $controller('CryptographCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CryptographCtrl.awesomeThings.length).toBe(3);
  });
});
