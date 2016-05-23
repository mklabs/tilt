const fs           = require('fs');
const path         = require('path');
const glob         = require('glob');
const debug        = require('debug')('tilt');
const http         = require('http');
const finalhandler = require('finalhandler');
const ReactViews   = require('tilt-react-views');
const Sequelize    = require('sequelize');
const serve        = require('serve-static')
const Asset        = require('tilt-assets').Asset;
const Router       = require('./router');
const anybody      = require('body/any');

class Tilt {
  constructor(options) {
    this.options = options || {};
    this.options.port = this.options.port || 3000;

    this.options.db = this.options.db || {};
    this.options.db.schema = this.options.db.schema || 'database';
    this.options.db.user = this.options.db.user || 'root';
    this.options.db.password = this.options.db.password || '';

    this.controllerPattern = this.options.controllers || 'app/controllers/*';
    this.modelsPattern = this.options.models || 'app/models/*';
    this.viewsPattern = this.options.views || 'app/views/';

    this.assets(this.options.assets || 'app/assets/');

    this._controllers = [];
    this._models = [];
    this.middlewares = [];
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

  static(pattern) {
    this.staticPattern = pattern;
    return this;
  }

  assets(pattern) {
    this.asset = new Asset({
      dirs: pattern
    });

    return this;
  }

  use(middleware) {
    this.middlewares.push(middleware);
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

  reactMiddleware(req, res, next) {
    res.render = this.engine.render.bind(this.engine, req, res, (err) => {
      if (err) {
        debug('Error rendering %s', req.url, err);
      }
    });

    next();
  }

  redirectMiddleware(req, res, next) {
    // Redirect
    res.redirect = function(location) {
      debug('Redirect to %s', location);
      res.writeHead(301, { Location: location });
      res.end();
    };

    next();
  }

  createServer() {
    debug('Create server');

    var middlewares = this.middlewares;
    middlewares = middlewares.concat(this.staticMiddlewares(this.staticPattern));
    middlewares.push(this.redirectMiddleware.bind(this));
    middlewares.push(this.bodyMiddleware.bind(this));
    middlewares.push(this.reactMiddleware.bind(this));
    middlewares.push(this.controllersMiddleware.bind(this));

    return http.createServer(Router.handle({
      asset: this.asset,
      middlewares: middlewares
    }));
  }

  bodyMiddleware(req, res, next) {
    anybody(req, (err, body) => {
      req.body = body;
      next();
    });
  }

  // Returns a list of serve-static middlewares based on provided pattern
  staticMiddlewares(pattern) {
    if (!pattern) return [];

    var dirs = glob.sync(this.staticPattern);
    debug('Static dirs', dirs);

    return dirs.map((dir) => {
      return serve(dir)
    });
  }

  // Lookup routes from our controller stack
  controllersMiddleware(req, res, next) {
    var response = false;

    this._controllers.forEach((controller) => {
      var matched = controller.match(req);

      if (!matched || response) return;

      response = true;
      controller.dispatch(req, res, next);
    });
  }
}

module.exports = Tilt;
