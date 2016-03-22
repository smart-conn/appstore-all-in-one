<<<<<<< HEAD
"use strict";
=======
'use strict';

const Sequelize = require('sequelize');
>>>>>>> 2130fd92f3510e12681adab0458096c9ff85dcf7

module.exports = function(sequelize) {
    sequelize.define('device', {
        alias: Sequelize.STRING,
        accessToken: Sequelize.TEXT,
        appManifest: Sequelize.TEXT,
        alongTo: Sequelize.STRING //relationship to user
    });
};
