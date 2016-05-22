const fs           = require('fs');
const path         = require('path');
const glob         = require('glob');
const debug        = require('debug')('tilt');
const http         = require('http');
const finalhandler = require('finalhandler');
const ReactViews   = require('tilt-react-views');
const Sequelize    = require('sequelize');
const anybody      = require('body/any');

class Tilt {
  constructor(options) {
    this.options = options || {};
    this.options.port = this.options.port || 3000;
    this.options.notFound = this.options.notFound || path.join(__dirname, 'resources/404.html');

    this.options.db = this.options.db || {};
    this.options.db.schema = this.options.db.schema || 'database';
    this.options.db.user = this.options.db.user || 'root';
    this.options.db.password = this.options.db.password || '';

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

  start(done) {
    debug('Starting server');

    return this.initDb()
      .then(this.init.bind(this))
      .then(this.syncDb.bind(this))
      .then(this.listen.bind(this))
      .catch((e) => {
        throw e;
      })
      .then(done);
  }

  init() {
    debug('Init');
    return new Promise((r, errback) => {
      try {
        this._controllers = this.loadControllers();
        this.loadViews();
        this.server = this.createServer();
      } catch(e) {
        debug('Error init', e);
        return errback(e);
      }

      return r();
    });
  }

  initDb() {
    debug('Init db');
    return new Promise((r, errback) => {
      debug('Init sequelize with', this.options.db);
      try {
        this.db = new Sequelize(this.options.db.schema, this.options.db.user, this.options.db.password);
      } catch(e) {
        return errback(e);
      }

      return r();
    });
  }

  syncDb() {
    debug('Syncing DB');
    return this.db.sync(process.env.NODE_ENV !== 'production' ? { force: true } : {});
  }

  listen(done) {
    debug('Listening on http://localhost:%d', this.options.port);
    return new Promise((r, errback) => {
      done = done || console.log.bind(console, 'Server started on %d', this.options.port);
      this.server.listen(this.options.port, (err) => {
        if (err) return errback(err);
        r();
      });
    });
  }

  createServer() {
    debug('Create server');

    return http.createServer((req, res) => {
      debug('Incoming request', req.url);
      var response = false;

      var done = (err) => {
        if (err) return this.error(err, req, res);
      };

      // Setup body-parser middleware
      debug('Init middlewares');

      // Bind react rendering
      res.render = this.engine.render.bind(this.engine, req, res, done);

      // Redirec
      res.redirect = function(location) {
        debug('Redirect to %s', location);
        res.writeHead(301, { Location: location });
        this.end();
      };

      // Body parser
      anybody(req, (err, body) => {
        req.body = body;

        // Lookup routes from our controller stack
        this._controllers.forEach((controller) => {
          var matched = controller.match(req);

          if (!matched) return;

          response = true;
          controller.dispatch(req, res, done);
        });

        if (!response) return this.notFound(req, res);
      });

    });
  }

  notFound(req, res) {
    debug('No route found for', req.url);
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 404;
    fs.createReadStream(this.options.notFound).pipe(res);
    return this;
  }

  error(err, req, res) {
    debug('Internal server error for', req.url);
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 500;
    res.end('Error: ' + process.env.NODE_ENV === 'production' ? err.message : err.stack);
    return this;
  }

  loadControllers() {
    var controllers = glob.sync(path.resolve(this.controllerPattern));

    controllers = controllers.map((pathname) => {
      debug('Loading controller: %s', pathname);
      var Controller = require(pathname);
      return new Controller(this.db);
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
