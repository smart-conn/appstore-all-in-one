"use strict";

module.exports = function(sequelize) {
    sequelize.define('device', {
        alias: Sequelize.STRING,
        accessToken: Sequelize.TEXT,
        appManifest: Sequelize.TEXT,
        alongTo: Sequelize.STRING //relationship to user
    });
};