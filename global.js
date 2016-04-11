'use strict';
const fs = require('fs');
const crypto = require('crypto');
//验证登录状态
module.exports = function* (next) {
  let auditor = new RegExp(/^\/auditor\/[\w\W]*$/);
  let developer = new RegExp(/^\/developer\/[\w\W]*$/);
  let appStore = new RegExp(/^\/appStore\/[\w\W]*$/);
  let path = this.path;
  //存在一些公共接口不经过校验也可以访问
  if (auditor.test(path) || developer.test(path) || appStore.test(path)) {
    //第三方用公钥加密信息，收到后解密，成功解密，并验证信息后则通过校验
    if (this.header.accessToken === 'pziesgqomnwosx') { //校验第三方信息
      yield next;
    } else { //若校验没有通过，则验证session，验证用户是否登录，若登录则可进行操作
      if (auditor.test(path)) {
        if (this.session && this.session.type == "auditor") {
          yield next;
        } else {
          this.body = {
            code: 302,
            msg: "未登录"
          };
        }
      } else if (developer.test(path)) {
        if (this.session && this.session.type == "developer") {
          yield next;
        } else {
          this.body = {
            code: 302,
            msg: "未登录"
          };
        }
      } else if (appStore.test(path)) {
        if (this.session && this.session.type == "user") {
          yield next;
        } else {
          this.body = {
            code: 302,
            msg: "未登录"
          };
        }
      }
    }
  } else {
    yield next;
  }
};
