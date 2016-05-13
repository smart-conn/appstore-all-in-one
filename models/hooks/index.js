module.exports = (sequelize) => {
  [
    require('./hook')
  ].forEach((model) => {
    model(sequelize);
  });
}
