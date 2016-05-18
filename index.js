
var glob = require('glob');
var Tilt = require('./src/tilt');

module.exports = tilt;

function tilt() {
  return new Tilt();
}
