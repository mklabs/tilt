
var Controller = require('../../../..').Controller;

class Home extends Controller {
  get routes() {
    return {
      '/home': 'index'
    };
  }

  index(req, res) {
    console.log('Incoming request:', req.url);
    return res.end('Response from home!');
  }
}


module.exports = Home;
