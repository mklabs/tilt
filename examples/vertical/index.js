
// Trying to set up here the API I'd like to have
//
// Really similar to express

var path = require('path');

var tilt = require('../..')();

// Setting up controllers glob, default: app/controllers/*
tilt.controllers(path.join(__dirname, 'app/controllers/*'));

// Views
tilt.views(path.join(__dirname, 'app/views/'));

// Same for models
tilt.models(path.join(__dirname, 'app/models/*'));

// Static / public directories (pattern must end with a "/")
tilt.static(path.join(__dirname, 'app/public/'));

// Assets directories
tilt.assets(path.join(__dirname, 'app/assets/'));

tilt.start(function(err) {
  if (err) throw err;
  console.log('Server started');
});
