'use strict';
/**
 * role 角色名
 * secret jwt密钥
 */
module.exports = (role, secret) => {
  const jwt = require('jsonwebtoken');

  return function* (next) {
    if (this.header && this.header.authorization) {
      let parts = this.header.authorization.split(' ');
      if (parts.length === 2) {
        let scheme = parts[0];
        let credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
          try {
            let userScope = jwt.decode(credentials, secret);
            if (userScope.scope.indexOf(role) !== -1) {
              this.req.user = userScope;
              yield next;
            } else {
              console.log("No Authorization.");
              this.body = {
                code: 403,
                msg: "No Authorization."
              };
            }
          } catch (e) {
            console.log("Bad Authorization.");
            this.body = {
              code: 403,
              msg: "Bad Authorization."
            };
          }
        } else {
          console.log('Bad Authorization header format. Format is "Authorization: Bearer <token>"\n');
          this.body = {
            code: 403,
            msg: "Bad Authorization."
          };
        }
      } else {
        console.log('Bad Authorization header format. Format is "Authorization: Bearer <token>"\n');
        this.body = {
          code: 403,
          msg: "Bad Authorization."
        };
      }
    } else {
      console.log('Bad Authorization header format. Format is "Authorization: Bearer <token>"\n');
      this.body = {
        code: 403,
        msg: "Bad Authorization."
      };
    };
  };
};
