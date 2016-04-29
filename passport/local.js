'use strict'

module.exports = (passport, User) => {
  passport.use(User.createStrategy());
};
