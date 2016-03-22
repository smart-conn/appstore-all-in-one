'use strict';
const Sequelize = require('sequelize');

module.exports = (database, username, password, host, dialect) => {
    return new Sequelize(database, username, password, {
        host,
        dialect
    });
}
