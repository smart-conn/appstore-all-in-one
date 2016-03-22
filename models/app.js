"use strict";
const Sequelize = require("sequelize");
module.exports = function(sequelize) {
    sequelize.define('app', {
        id: { type: Sequelize.STRING, primaryKey: true },
        version: Sequelize.STRING,
        flow: Sequelize.TEXT,
        author: Sequelize.STRING
    });
};