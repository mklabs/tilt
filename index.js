
var glob = require('glob');
var Tilt = require('./lib/tilt');

module.exports = tilt;
tilt.Tilt = Tilt;

function tilt() {
  return new Tilt();
}
