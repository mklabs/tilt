const fs         = require('fs');
const path       = require('path');
const glob       = require('glob');
const debug      = require('debug')('tilt');
const browserify = require('browserify');
const watchify   = require('watchify');
const postcss    = require('postcss');
const precss     = require('postcss');
const scss       = require('postcss-scss');

class Asset {

  get handlers() {
    return {
      '.js':  'browserify',
      '.css': 'cssnext'
    };
  }

  constructor(options = {}) {
    this.options = options;
    this.assetsPattern = this.options.assetsPattern || 'app/assets/';
    // init
  }

  // Asset pipeline thing
  handle(req, res, next) {
    var filename = path.join(this.assetsPattern, req.url.replace('/assets/', ''));

    debug('Asset %s (%s)', req.url, filename);
    return glob(filename, (err, files) => {
      if (err) return next(err);
      if (!files.length) return next(new Error('Asset ' + filename + ' not found'));

      var file = files[0];

      debug('Asset found:', file);

      return this.compile(file, req, res, next);
    });

    // 1. Lookup asset in configured assets dir
    // 2. If found and filetype handled, process (browserify)
    // 3. Serve response
  }

  compile(file, req, res, next) {
    var ext = path.extname(file);

    var handler = this.handlers[ext];
    if (!handler) return next('Filetype ' + ext + ' not supported');

    debug('Compile using %s handler', this.handlers[ext]);
    var method = this[handler];
    method.apply(this, arguments);
  }

  browserify(file, req, res, next) {
    var b = browserify({
      entries: [ file ]
    });

    b.transform('babelify', {
      presets: ['es2015']
    });

    b.bundle().pipe(res);
  }

  cssnext(file, req, res, next) {
    debug('Read file', file);
    fs.readFile(file, 'utf8', (err, css) => {
      if (err) return next(err);

      var bundle = postcss([ precss() ]);
      return bundle.process(css, { parser: scss, from: file, to: 'test.css' })
        .catch((err) => {
          debug('Error', err);
          return next(err);
        })
        .then((result) => {
          console.log('res:', result.css);
          res.end(result.css);
        });
    });
  }
}

module.exports = Asset;
