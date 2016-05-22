
var tilt = require('../../../..');

// Figuring out the API
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
