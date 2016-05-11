'use strict';

module.exports = (app) => {
  [
    require('./get'),
    require('./cart')
  ].forEach((appStore) => {
    appStore(app);
  });
};
