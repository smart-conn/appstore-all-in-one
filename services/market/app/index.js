'use strict';
module.exports = (app) => {
  [
    require('./get'),
    require('./upload')
  ].forEach((application) => {
    application(app);
  });
};
