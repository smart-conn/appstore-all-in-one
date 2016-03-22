const Sequelize = require('sequelize');

module.exports = function(sequelize) {

  sequelize.define('device', {
    alias: Sequelize.STRING
  });

};
