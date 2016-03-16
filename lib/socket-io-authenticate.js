'use strict';

const jwt = require('jsonwebtoken');
const url = require('url');
const querystring = require('querystring');

function getAccessToken(socket) {
  return socket.handshake.query.accesstoken;
}

function getSecret() {
  return 'secret';
}

module.exports = function(socket, callback) {
  try {
    const accessToken = getAccessToken(socket);
    const secret = getSecret();
    jwt.verify(accessToken, secret, (err, decoded) => {
      if (err) return callback(err);
      const alias = decoded.alias;
      return socket.join(alias, callback);
    });
  } catch (err) {
    callback(err);
  }
};
