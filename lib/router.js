
var debug = require('debug')('tilt:router');
var ClassyRouter = require('classy-router');
var pathToRegexp = require('path-to-regexp');

class Router extends ClassyRouter {
  constructor(options) {
    super(options);
  }

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
