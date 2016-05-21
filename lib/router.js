
var debug        = require('debug')('tilt:router');
var TiltRouter   = require('tilt-router');
var pathToRegexp = require('path-to-regexp');

class Router extends TiltRouter {
  match(req) {
    // figure out which route to invoke based on url
    var pattern = pathToRegexp(req.url);
    debug('Routes', this._routes);
    var route = this._routes.find((route) => {
      debug('Check %s vs %s', req.method.toLowerCase(), route.verb, route.path);
      return req.method.toLowerCase() === route.verb && pattern.test(route.path);
    });

    return !!route;
  }
}


module.exports = Router;
