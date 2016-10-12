'use strict';

describe('Controller: ButtonmashCtrl', function () {

  // load the controller's module
  beforeEach(module('enigmaApp'));

  var ButtonmashCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ButtonmashCtrl = $controller('ButtonmashCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ButtonmashCtrl.awesomeThings.length).toBe(3);
  });
});
