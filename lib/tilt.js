const fs           = require('fs');
const path         = require('path');
const glob         = require('glob');
const debug        = require('debug')('tilt');
const http         = require('http');
const finalhandler = require('finalhandler');
const ReactViews   = require('tilt-react-views');

class Tilt {
  constructor(options) {
    this.options = options || {};
    this.options.port = this.options.port || 3000;
    this.options.notFound = this.options.notFound || path.join(__dirname, 'resources/404.html');

    this.controllerPattern = this.options.controllers || 'app/controllers/*';
    this.modelsPattern = this.options.models || 'app/models/*';
    this.viewsPattern = this.options.views || 'app/views/';

    this._controllers = [];
    this._models = [];
  }

  controllers(pattern) {
    this.controllerPattern = pattern;
    return this;
  }

  models(pattern) {
    this.models = pattern;
    return this;
  }

  views(pattern) {
    this.viewsPattern = pattern;
    return this;
  }

  init() {
    this._controllers = this.loadControllers();
    this.loadViews();
    this.server = this.createServer();
    return this;
  }

  start(done) {
    debug('Starting server');
    this.init();
    this.listen(done);
    return this;
  }

  createServer() {
    return http.createServer((req, res) => {
      debug('Incoming request', req.url);
      var done = finalhandler(req, res);
      var response = false;

      // Bind react rendering
      res.render = this.engine.render.bind(this.engine, req, res, done);

      // Lookup routes from our controller stack
      this._controllers.forEach((controller) => {
        var matched = controller.match(req);

        if (!matched) return;

        response = true;
        controller.dispatch(req, res);
      });

      if (!response) return this.notFound(req, res);
    });
  }

  notFound(req, res) {
    debug('No route found for', req.url);
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 404;
    fs.createReadStream(this.options.notFound).pipe(res);
    return this;
  }

  listen(done) {
    done = done || console.log.bind(console, 'Server started on %d', this.options.port);
    this.server.listen(this.options.port, done);
    return this;
  }

  loadControllers() {
    var controllers = glob.sync(path.resolve(this.controllerPattern));

    controllers = controllers.map((pathname) => {
      debug('Loading controller: %s', pathname);
      var Controller = require(pathname);
      return new Controller();
    });

    return controllers;
  }

  loadViews() {
    var views = glob.sync(path.resolve(this.viewsPattern));
    debug('Views dirs %s (Pattern: %s)', views.join(' '), this.viewsPattern);
    this.engine = new ReactViews({ views });
    return this;
  }
}

module.exports = Tilt;
