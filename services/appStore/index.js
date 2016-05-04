'use strict';

module.exports = (app) => {
  [require('./get')].forEach((appStore) => {
    appStore(app);
  });
};
