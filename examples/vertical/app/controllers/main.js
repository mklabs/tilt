
var Controller = require('../../../..').Controller;

class Router extends Controller {
  get routes() {
    return {
      '/': 'index'
    };
  }

  index(req, res) {
    return res.render('index', { name: 'Title!' });
  }
}

module.exports = Router;
