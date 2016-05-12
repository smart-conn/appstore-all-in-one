'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  [
    require('./content'),
    require('./device')
  ].forEach((model) => {
    model(sequelize);
  });
}
