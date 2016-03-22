"use strict";
const Sequelize = require("sequelize");

module.exports = function(sequelize) {

    sequelize.define('user', {
        accessToken: Sequelize.STRING,
        appManifest: Sequelize.TEXT
    });

};