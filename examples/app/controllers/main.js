
var TiltRouter = require('../../../lib/router');

class Router extends TiltRouter {
  get routes() {
    return {
      '/': 'index'
    };
  }

  index(req, res) {
    console.log('Incoming request:', req.url);
    return res.render('index', { name: 'Title!' });
  }
}


module.exports = Router;
