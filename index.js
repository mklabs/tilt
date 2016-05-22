
var glob = require('glob');
var Tilt = require('./lib/tilt');

module.exports = tilt;
tilt.Tilt = Tilt;
tilt.Controller = require('./lib/router');
tilt.Model = require('./lib/model');
tilt.Sequelize = require('sequelize');

function tilt() {
  return new Tilt();
}
