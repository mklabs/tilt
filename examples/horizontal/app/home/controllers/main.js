
var Controller = require('../../../../..').Controller;

class HomeController extends Controller {
  get routes() {
    return {
      '/': 'index'
    };
  }

  index(req, res) {
    return res.render('index', { name: 'Title!' });
  }
}


module.exports = HomeController;
