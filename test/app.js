
var Tilt = require('..');
var assert = require('assert');

describe('Stuff', () => {

  before(() => {
    this.tilt = new Tilt();
  });

  it('Returns the list of controllers', () => {
    this.tilt.controllers('examples/app/controllers/*');
    var controllers = this.tilt.loadControllers();
    assert.ok(controllers.length);
  });

});
