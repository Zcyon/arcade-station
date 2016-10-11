'use strict';

describe('Controller: PongCtrl', function () {

  // load the controller's module
  beforeEach(module('enigmaApp'));

  var PongCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PongCtrl = $controller('PongCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PongCtrl.awesomeThings.length).toBe(3);
  });
});
