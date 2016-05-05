'use strict';
module.exports = (app) => {
  [
    require('./cart'),
    require('./get')
  ].forEach((appStore) => {
    appStore(app);
  });
}
