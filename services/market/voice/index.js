'use strict';
module.exports = (app) => {
  [
    require('./get'),
    require('./upload')
  ].forEach((voice) => {
    voice(app);
  });
};
