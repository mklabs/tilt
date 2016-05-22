var Sequelize = require('sequelize');
var debug = require('debug')('tilt:model');

var db = new Sequelize('database', 'root', '');


// AFK 5-10mins ...

class Model {
  constructor(attrs, options, db) {
    debug('Init model', attrs);

    this.attrs = attrs || {};
    if (!db) {
      db = options;
      options = {};
    }

    var options = Object.assign({}, this.options, options);

    this.db = db;
    this.name = options.name || this.__proto__.constructor.name;

    if (!this.db) throw new Error('Missing DB instance');
    this.sequelize = this.db.define(this.name, this.attributes, options);

    // Proxy sequelize methods over our model instance
    Object.keys(this.sequelize.__proto__).forEach((method) => {
      this[method] = this.sequelize[method].bind(this.sequelize);
    });
  }

  save() {
    var sequelizeInstance = this.build(this.attrs);
    return sequelizeInstance.save();
  }
}

module.exports = Model;
