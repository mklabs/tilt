
var tilt    = require('..');
var assert  = require('assert');
var request = require('supertest');

describe('Tilt', () => {

  it('Returns the list of controllers', () => {
    var app = new tilt.Tilt();
    app.controllers('examples/vertical/app/controllers/*');
    var controllers = app.loadControllers();
    assert.ok(controllers.length);
  });

  describe('HTTP server', () => {

    before(() => {
      this.app = tilt()
        .controllers('examples/vertical/app/controllers/*')
        .init();
    });

    it('Renders 404 html', (done) => {
      request(this.app.server)
        .get('/blah')
        .expect('Content-Type', 'text/html')
        .expect(404)
        .end(done);
    });

    it('Renders homepage', (done) => {
      request(this.app.server)
        .get('/')
        .expect('Content-Type', 'text/html')
        .expect(/Hello Title/)
        .end(done);
    });

    it('Renders /home', (done) => {
      request(this.app.server)
        .get('/home')
        .expect(/Response from/)
        .end(done);
    });
  });
});
