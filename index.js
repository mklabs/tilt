
var glob = require('glob');
var Tilt = require('./lib/tilt');

module.exports = tilt;
tilt.Tilt = Tilt;
tilt.Controller = require('./lib/router');

function tilt() {
  return new Tilt();
}
