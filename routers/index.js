'use strict';
module.exports = (app) => {
  [
    require('./adminApp'),
    require('./appStore'),
    require('./auditor'),
    require('./developer'),
    require('./development'),
    require('./main'),
    require('./login')
  ].forEach((route) => {
    route(app);
  });
}
