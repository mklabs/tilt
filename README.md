# tilt [![Build Status](https://secure.travis-ci.org/mklabs/tilt.png)](http://travis-ci.org/mklabs/tilt)

> wip

Minimalist, ES6 based, developer-friendly web framework for node.

Inspired by Play Framework and Sails / Trails.

Tilt aims to be a lightweight framework to quickly develop new nodejs application
using a set of common tools that works well together.

It provides a clear and concise way to define routers / controllers on top of a
simple React based view engine.

## Features

- Simple and concise Routers / Controllers
- React Based view engine
- Vertical or horizontal architecture (http://www.slideshare.net/ChristianHujer/vertical-vs-horizontal-software-architecture-ruby-conf-india-2016-59817161)

> wip: [todo](https://github.com/mklabs/tilt/issues/8)

## 🐰  Development documentation


    git clone https://github.com/mklabs/tilt.git
    cd tilt
    npm run watch &
    npm run start

- `npm run start` to start the server. It'll run babel once before.
- `npm run watch` will recompile and relaunch the tests.

The lib/ folder is where sources are, the src/ folder are where generated sources are.

## Example

```js
var tilt = require('tilt');

var app = tilt()
  // Controller glob patterns (default: 'app/controllers/*')
  .controllers('app/controllers/*')
  // Same for models (default: 'app/models/*')
  .models('app/models/*')
  // Views directory glob pattern (default: 'app/views/', must end with a "/")
  .views('app/views/')
  // Init tilt and start the server (default: http://localhost:3000)
  .start(function() {
    console.log('Server started');
  });
```

**app/controllers/main.js**

Controllers (or Routers) are standard ES6 Class that inherits from `tilt.Controller`.

They implement a `routes` hash that defines the mapping between URLs pattern
and class methods / request handlers.

`req` and `res` are standard node HTTP request and response, with
`res.render(filename, { ... })` being added to provide a basic React rendering
engine.

React JSX views are automatically transpiled by Babel when the framework requires them.

See [tilt-router](https://github.com/mklabs/tilt-router) for more information.

```js
var Controller = require('tilt').Controller;

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
```

**app/views/index.jsx**

See [tilt-react-views](https://github.com/mklabs/tilt-react-views) for more information.

```js
var React = require('react');

var HelloMessage = React.createClass({
  render: function() {
    return (<div>Hello {this.props.name}</div>);
  }
});

module.exports = HelloMessage;
```

**app/models/user.js**

Models inherits from `tilt.Model` to provide a thin abstraction on top of
[Sequelize](http://docs.sequelizejs.com/en/latest/).

Both attributes and options getters maps the `sequelize.define('name',
{attributes}, {options})`a equivalent.

- `attributes` Specifiy the Model schema ([Model Definition](http://docs.sequelizejs.com/en/latest/docs/models-definition/))
- `options` Specifiy the Model options

Most of [Sequelize Model API](http://docs.sequelizejs.com/en/latest/api/model/) is available on `tilt.Model` instances.

```js
var tilt = require('tilt');

class User extends tilt.Model {
  get attributes() {
    return {
      username: tilt.Sequelize.STRING,
      birthday: tilt.Sequelize.DATE
    };
  }

  get options() {}
}

module.exports = User;
```

Then used like so:

```js
create(req, res, next) {
  var user = new User({
    username: 'foobar',
    birthday: new Date()
  }, this.db);

  user.save()
    .catch(next)
    .then(() => {
      res.end('User saved');
    });
}
```

## Tests

    npm test

- [Tilt](#tilt)
 - [HTTP server](#tilt-http-server)
 - [HTTP server with module based architecture](#tilt-http-server-with-module-based-architecture)

<a name="tilt"></a>
### Tilt
Returns the list of controllers.

```js
var app = new tilt.Tilt();
app.controllers('examples/vertical/app/controllers/*');
var controllers = app.loadControllers();
assert.ok(controllers.length);
```

<a name="tilt-http-server"></a>
#### HTTP server

```js
before(() => {
  this.app = tilt()
    .controllers('examples/vertical/app/controllers/*')
    .views('examples/vertical/app/views/')
    .init();
});
```

Renders 404 html.

```js
request(this.app.server)
  .get('/blah')
  .expect('Content-Type', 'text/html')
  .expect(404)
  .end(done);
```

Renders homepage.

```js
request(this.app.server)
  .get('/')
  .expect('Content-Type', 'text/html')
  .expect(/Hello Title/)
  .end(done);
```

Renders /home.

```js
request(this.app.server)
  .get('/home')
  .expect(/Response from/)
  .end(done);
```

<a name="tilt-http-server-with-module-based-architecture"></a>
#### HTTP server with module based architecture

```js
before(() => {
  this.app = tilt()
    .controllers('examples/horizontal/app/*/controllers/*')
    .views('examples/horizontal/app/*/views/')
    .init();
});
```

Renders 404 html.

```js
request(this.app.server)
  .get('/blah')
  .expect('Content-Type', 'text/html')
  .expect(404)
  .end(done);
```

Renders homepage.

```js
request(this.app.server)
  .get('/')
  .expect('Content-Type', 'text/html')
  .expect(/Hello Title/)
  .end(done);
```

Renders /profile.

```js
request(this.app.server)
  .get('/profile')
  .expect(/Response from profile module/)
  .end(done);
```

Renders /profile/template.

```js
request(this.app.server)
  .get('/profile/template')
  .expect(/Response from profile module using a React view/)
  .end(done);
```

