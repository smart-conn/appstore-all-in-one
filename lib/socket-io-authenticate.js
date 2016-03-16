'use strict';

const jwt = require('jsonwebtoken');
const url = require('url');
const querystring = require('querystring');

function getQuery(uri, key) {
  return querystring.parse(url.parse(uri).query)[key];
}

function getSecret() {
  return 'secret';
}

module.exports = function(socket, callback) {
  const uri = socket.handshake.url;
  const accessToken = getQuery(uri, 'accesstoken');
  const secret = getSecret();
  jwt.verify(accessToken, secret, (err, decoded) => {
    if (err) return callback(err);
    const alias = decoded.alias;
    return socket.join(alias, callback);
  });
};
