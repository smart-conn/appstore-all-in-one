'use strict';
module.exports = (app) => {
  [
    require('./deal'),
    require('./purse')
  ].forEach((settle) => {
    settle(app);
  });
};
