'use strict';
module.exports = (app) => {
  [
    require('./app'),
    require('./voice')
  ].forEach((market) => {
    market(app);
  });
};
