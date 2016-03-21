'use strict';

const koa = require('koa');
const nconf = require('nconf');
const socketIO = require('socket.io');
const EventEmitter = require('events');
const http = require('http');
const Sequelize = require('sequelize');

// middlewares
const bodyParser = require('koa-bodyparser');
const errorHandler = require('koa-error');
const morgan = require('koa-morgan');
const serveStatic = require('koa-static');

// helper
const rpc = require('./lib/amqp-rpc');
const socketIoAuthenticate = require('./lib/socket-io-authenticate');

class Application extends EventEmitter {

  constructor() {
    super();
    this._configure(process.env.NODE_ENV);
    var app = this.app = koa();
    var server = this.server = http.createServer(app.callback());
    var io = this.io = socketIO();
    var amqp = this.amqp = rpc(this.getConfig('brokerAddress') || 'amqp://127.0.0.1');
    this._initKoa(app, io, amqp);
    this._initSocketIO(io, server);
    this._initSequelize();
    this._initServices();
  }

  setContext(key, value) {
    this.app.context[key] = value;
    return this;
  }

  getContext(key) {
    return this.app.context[key];
  }

  getConfig(key) {
    return nconf.get(key);
  }

  start() {
    const PORT = this.getConfig('port') || 3000;
    return new Promise((resolve, reject) => {
      try {
        this.server.listen(PORT, () => {
          this.emit('startup');
          resolve();
        });
      } catch(err) {
        reject(err);
      }
    });
  }

  _initSocketIO(io, server) {
    io.attach(server);
    io.of('/nasc').use(socketIoAuthenticate);
  }

  _initKoa(app, io, amqp) {
    this.setContext('io', io);
    this.setContext('amqp', amqp);
    app.use(errorHandler());
    app.use(morgan.middleware('dev'));
    app.use(serveStatic(`${__dirname}/public`));
    app.use(bodyParser());
    require('./routers').forEach((router) => {
      app.use(router);
    });
  }

  _initSequelize() {
    const database = this.getConfig('database');
    const username = this.getConfig('username');
    const password = this.getConfig('password');
    const host = this.getConfig('host');
    const dialect = this.getConfig('dialect');

    const sequelize = new Sequelize(database, username, password, {
      host,
      dialect
    });

    this.setContext('sequelize', sequelize);
  }

  _initModels() {

  }

  _initServices() {
    require('./services').forEach((service) => {
      service(this);
    });
  }

  _configure(env) {
    const NODE_ENV = env || 'development';
    nconf.argv().env();
    nconf.file(`config.${NODE_ENV}.json`);
  }

}

module.exports = function factory() {
  return new Application();
};
