var path = require('path');
var glob = require('glob');
var debug = require('debug')('tilt');
var http = require('http');
var finalhandler = require('finalhandler');

class Tilt {
  constructor(options) {
    this.options = options || {};
  }

  controllers(pattern) {
    this._controllers = pattern;
  }

  models(pattern) {
    this._models = pattern;
  }

  start(done) {
    debug('Starting server');
    debug('Loading controllers');
    this.loadControllers();
  }

  loadControllers() {
    var controllers = glob.sync(path.resolve(this._controllers));

    var modules = controllers.map((pathname) => {
      debug('Loading path %s', pathname);
      return require(pathname);
    });

    this.server = http.createServer((req, res) => {
      var done = finalhandler(req, res);
      debug('Incoming request', req.url);

      modules.forEach((Controller) => {
        var controller = new Controller();
        var matched = controller.match(req);
        debug('%s url matched ?', req.url, matched);

        if (!matched) return;

        controller.dispatch(req, res);
      });
    });

    this.server.listen(3000, console.log.bind(console, 'Server started on 3000'));
    return controllers;
  }
}

module.exports = Tilt;
