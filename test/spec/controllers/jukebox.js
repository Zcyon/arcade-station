'use strict';

describe('Controller: JukeboxCtrl', function () {

  // load the controller's module
  beforeEach(module('enigmaApp'));

  var JukeboxCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JukeboxCtrl = $controller('JukeboxCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(JukeboxCtrl.awesomeThings.length).toBe(3);
  });
});
