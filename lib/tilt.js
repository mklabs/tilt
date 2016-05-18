const path = require('path');
const glob = require('glob');
const debug = require('debug')('tilt');
const http = require('http');
const finalhandler = require('finalhandler');
const ViewsReact = require('views-react');

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

    const views = new ViewsReact({
      views: path.join(__dirname, '../examples/app/views')
    });

    this.server = http.createServer((req, res) => {
      var done = finalhandler(req, res);

      debug('Incoming request', req.url);
      res.render = views.render.bind(views, req, res, done);

      modules.forEach((Controller) => {
        var controller = new Controller();
        var matched = controller.match(req);

        if (!matched) return;
        controller.dispatch(req, res);
      });
    });

    this.server.listen(3000, console.log.bind(console, 'Server started on 3000'));
    return controllers;
  }
}

module.exports = Tilt;
