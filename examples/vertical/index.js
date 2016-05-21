
// Trying to set up here the API I'd like to have
//
// Really similar to express

var path = require('path');

var tilt = require('../..')();

// Setting up controllers glob, default: app/controllers/*
tilt.controllers(path.join(__dirname, 'app/controllers/*'));

// Same for models
tilt.models('app/models/*');

tilt.start(function(err) {
  if (err) throw err;
  console.log('Server started');
});
