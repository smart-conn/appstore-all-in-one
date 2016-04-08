'use strict';

const koa = require('koa');
const nconf = require('nconf');
const EventEmitter = require('events');
const http = require('http');
const Sequelize = require('sequelize');
const sio = require('socket.io');
const session = require('koa-session');
// middlewares
const bodyParser = require('koa-bodyparser');
const errorHandler = require('koa-error');
const morgan = require('koa-morgan');
const serveStatic = require('koa-static');

// helper
const amqpRPC = require('./lib/amqp-rpc');
const socketIoAuthenticate = require('./lib/socket-io-authenticate');

class Application extends EventEmitter {

  constructor() {
    super();
    this._configure(process.env.NODE_ENV);

    const amqp = this.amqp = this._initAMQP();
    const sequelize = this.sequelize = this._initSequelize();
    const koaApp = this.app = this._initKoa();
    const server = this.server = this._initServer(koaApp);
    const io = this.io = this._initSocketIO(server);

    this._injectKoaContext(io, sequelize, amqp);

    this._loadRouters(koaApp);
    this._loadModels(sequelize);

    this._loadModules(this);
  }

  getModel(name) {
    const sequelize = this.getContext('sequelize');
    // faker
    return sequelize.models[name];
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
      } catch (err) {
        reject(err);
      }
    });
  }

  _injectKoaContext(io, sequelize, amqp) {
    this._setContext('io', io);
    this._setContext('sequelize', sequelize);
    this._setContext('amqp', amqp);
  }

  _initSocketIO(server) {
    const io = sio();
    io.attach(server);
    return io;
  }

  _initServer(koaApp) {
    const server = http.createServer(koaApp.callback());
    return server;
  }

  _initAMQP() {
    const brokerAddress = this.getConfig('brokerAddress') || 'amqp://127.0.0.1';
    const broker = amqpRPC(brokerAddress);
    return broker;
  }

  _setContext(key, value) {
    this.app.context[key] = value;
    return this;
  }

  _initKoa() {
    const app = koa();
    app.use(errorHandler());
    app.use(morgan.middleware('dev'));
    app.use(serveStatic(`${__dirname}/public`));
    app.use(bodyParser());
    app.keys = ['wedudf&er$'];
    app.use(session(app));
    app.use(require('./global'));
    return app;
  }

  _initSequelize() {
    const database = this.getConfig('database');
    const username = this.getConfig('username');
    const password = this.getConfig('password');
    const host = this.getConfig('host');
    const dialect = this.getConfig('dialect');
    const storage = this.getConfig('storage');

    const sequelize = new Sequelize(database, username, password, {
      host,
      dialect,
      storage
    });

    return sequelize;
  }

  _loadModels(sequelize) {
    require('./models').forEach((model) => {
      model(sequelize);
    });
    require('./models/_relationships')(sequelize);
  }

  _loadRouters(koaApp) {
    require('./routers').forEach((router) => {
      koaApp.use(router);
    });
  }

  _loadModules(applicationInstance) {
    require('./services').forEach((service) => {
      service(applicationInstance);
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
