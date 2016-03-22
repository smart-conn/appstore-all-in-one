"use strict";

module.exports = function(sequelize) {

    sequelize.define('user', {
        accessToken: Sequelize.STRING,
        appManifest: Sequelize.TEXT
    });

};