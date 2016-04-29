'use strict';
const qs = require('querystring');
const https = require('https');
const request = require('request');

module.exports = (type, clientID, secret, code, redirectUri, amqp) => {
  let url;
  switch (type) {
    case 'github':
      url = "https://github.com/login/oauth/access_token?client_id=" + clientID +
        "&client_secret=" + secret + "&code=" + code + "&redirect_uri=" + redirectUri;
      break;
    case 'wechat':
      url = ""
      break;
  }
  return new Promise((resolve, reject) => {
    let accessTokenOptions = {
      url: url,
      headers: {
        'User-Agent': 'request'
      }
    }
    request(accessTokenOptions, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        let token = qs.parse(body.toString()).access_token;
        resolve(amqp.call('user.exist', {
          accessToken: token,
          type: type
        }));
      }
    });
  });
};
