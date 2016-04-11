"use strict";
//验证登录状态
module.exports = function* (next) {
  let auditor = new RegExp(/^\/auditor\/[\w\W]*$/);
  let developer = new RegExp(/^\/developer\/[\w\W]*$/);
  let appStore = new RegExp(/^\/appStore\/[\w\W]*$/);
  let path = this.path;
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
  } else {
    yield next;
  }
};
