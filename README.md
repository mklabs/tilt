# tilt

> wip

Minimalist, ES6 based, developer-friendly web framework for node.

Inspired by Play Framework and Sails / Trails.

It offers a lightweight framework to quickly develop new nodejs application
using a set of common tools that works well together. It provides a clear and
concise way to define routers / controllers and a simple React based view
engine.

## 🐰  Development documentation


    git clone https://github.com/mklabs/tilt.git
    cd tilt
    npm run watch &
    npm run start

- `npm run start` to start the server. I'll run babel once before.
- `npm run watch` will recompile and relaunch the tests.

The lib/ folder is where sources are, the src/ folder are where generated sources are.

## Features

- Simple and concise Routers / Controllers
- React Based view engine
- Vertical or horizontal architecture (http://www.slideshare.net/ChristianHujer/vertical-vs-horizontal-software-architecture-ruby-conf-india-2016-59817161)
- Models ORM using either Mongoose or Sequelize
- Simple Dependency Injection using angular/di.js and ES7 annotations.
- Developer friendly
  - Asset compiler - Using either browserify or webpack, with ES6/ES7 presets pre-configured.
  - Hit refresh workflow - Sources are compiled when they need to and server is restarted automatically using nodemon.
  - LiveReload - Assets are watched for changes, compiled down when they need
    to and browsers are notified for changes to dynamically live reload the
    pages.
  - Powerfull console and build tools - A custom REPL is available to inspect and debug your app.
  - Bult-in testing tools - Using supertest, testing controllers output and
    behavior is really easy. Enzyme provides helpers to test your React views.
  - Yeoman generators and templates to quickly scafold an entire app, or individual entities.


## Tools

tilt builds on the following tools

- nodemon
- react
- angular/di
- babel
- eslint
- supertest
- enzyme
