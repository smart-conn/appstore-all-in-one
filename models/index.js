module.exports = (sequelize) => {
  [
    require('./account'),
    require('./content'),
    require('./device'),
    // require('./hooks'),
    // require('./order'),
    // require('./purse'),
    require('./relationships')
  ].forEach((model) => {
    model(sequelize);
  });
}
