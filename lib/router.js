const debug        = require('debug')('tilt:router');
const TiltRouter   = require('tilt-router');
const pathToRegexp = require('path-to-regexp');
const anybody      = require('body/any');

class Router extends TiltRouter {
  // TODO: di
  constructor(db) {
    super();

    debug('Init Router');
    this.db = db;
  }

  match(req) {
    // figure out which route to invoke based on url
    var pattern = pathToRegexp(req.url);
    var route = this._routes.find((route) => {
      return req.method.toLowerCase() === route.verb && pattern.test(route.path);
    });

    return !!route;
  }

  // Main HTTP request handler
  static handle(options = {}) {
    var asset = options.asset;
    var engine = options.engine;
    var controllers = options.controllers;

    if (!asset) throw new Error('Missing asset handler');
    if (!engine) throw new Error('Missing template engine');
    if (!controllers) throw new Error('Missing controllers stack');

    return function (req, res) {
      debug('Incoming request', req.url);
      var response = false;

      var done = (err) => {
        if (err) return Router.error(err, req, res);
      };

      if (/^\/assets\//.test(req.url)) return asset.handle(req, res, done);

      // Setup body-parser middleware
      debug('Init middlewares');

      // Bind react rendering
      res.render = engine.render.bind(engine, req, res, done);

      // Redirect
      res.redirect = function(location) {
        debug('Redirect to %s', location);
        res.writeHead(301, { Location: location });
        res.end();
      };

      var middlewares = options.staticDirs.concat();

      (function nextDir(serveDir) {
        if (!serveDir) return next();

        debug('Init static middleware for %s', serveDir.dir);
        serveDir.middleware(req, res, (err) => {
          if (err) return Router.error(err, req, res);
          nextDir( middlewares.shift());
        });
      })(middlewares.shift());

      function next() {
        // Body parser
        anybody(req, (err, body) => {
          req.body = body;

          // Lookup routes from our controller stack
          controllers.forEach((controller) => {
            var matched = controller.match(req);

            if (!matched) return;

            response = true;
            controller.dispatch(req, res, done);
          });

          if (!response) return Router.notFound(req, res);
        });
      }
    };
  }

  static error(err, req, res) {
    debug('Internal server error for', req.url);
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 500;
    res.end('Error: ' + process.env.NODE_ENV === 'production' ? err.message : err.stack);
  }

  static notFound(req, res) {
    debug('No route found for', req.url);
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 404;
    fs.createReadStream(path.join(__dirname, 'resources/404.html')).pipe(res);
  }
}


module.exports = Router;
