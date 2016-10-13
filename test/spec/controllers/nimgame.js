'use strict';

describe('Controller: NimgameCtrl', function () {

  // load the controller's module
  beforeEach(module('enigmaApp'));

  var NimgameCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NimgameCtrl = $controller('NimgameCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NimgameCtrl.awesomeThings.length).toBe(3);
  });
});
