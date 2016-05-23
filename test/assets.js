var tilt    = require('..');
var assert  = require('assert');
var request = require('supertest');

describe('Tilt', () => {
  describe('HTTP /assets/', () => {
    before((done) => {
      var app = this.app = tilt();

      app
        .controllers('examples/vertical/app/controllers/*')
        .views('examples/vertical/app/views/')
        .initDb()
        .then(app.init.bind(app))
        .then(app.syncDb.bind(app))
        .then(() => {
          console.log('done');
          done();
        });
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
        .expect(/Bonjour Title/)
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
