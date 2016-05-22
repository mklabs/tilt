
var debug = require('debug')('tilt:example:controller:main');
var Controller = require('../../../..').Controller;
var User = require('../models/user');

class Router extends Controller {
  get routes() {
    return {
      '/':      'index',
      '/test':  'test',
    };
  }

  constructor(db) {
    super(db);
    debug('Init main controller');
    this.user = new User({
      username: 'John Doe',
      birthday: new Date()
    }, this.db);
  }

  index(req, res) {
    return res.render('index', { name: 'Title!' });
  }

  test(req, res) {
    this.user.save().then(() => {
      this.user.find({ where: { username: 'John Doe' } }).then((user) => {
        if (!user) return res.end('No data');
        return res.end('test:' +  JSON.stringify(user.dataValues));
      });
    });
  }
}

module.exports = Router;
