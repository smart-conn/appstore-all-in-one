'use strict';

module.exports = (app) => {
  [
    // require('./command-server'),
    // require('./socket-io-management'),

    require('./passport-satellizer'),
    require('./device-manager'),
    // require('./store-front'),
    require('./appAdmin/appAdmin'),
    // require('./developer/uploadApp'),
    // require('./developer/getAppByID'),
    require('./audit'),
    // require('./login'),
    require('./app'),
    require('./appState'),
    require('./thirdParty'),
    require('./market'),
    require('./appStore')
  ].forEach((service) => {
    service(app);
  });
}
