
var debug = require('debug')('tilt:example:controller:main');
var Controller = require('../../../..').Controller;
var User = require('../models/user');

class Router extends Controller {
  get routes() {
    return {
      '/':            'index',
      '/list':        'list',
      '/create':      'create',
      'POST /create': 'createPost',
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

  list(req, res) {
    this.user.findAll().then((users) => {
      debug('Users %d', users.length);
      res.render('list', { users });
    });
  }

  create(req, res, next) {
    res.render('create');
  }

  // Will probably have to parse req.body
  createPost(req, res, next) {
    debug('POST create', req.body);

    var user = new User(req.body, this.db);

    user.save()
      .catch(next)
      .then(() => {
        res.redirect('/list');
      });
  }
}

module.exports = Router;
