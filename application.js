'use strict';

const koa = require('koa');
const nconf = require('nconf');
const EventEmitter = require('events');
const http = require('http');
const Sequelize = require('sequelize');
const rabbit = require('rabbit.js');
const sio = require('socket.io');

// middlewares
const bodyParser = require('koa-bodyparser');
const errorHandler = require('koa-error');
const morgan = require('koa-morgan');
const serveStatic = require('koa-static');

// helper
const socketIoAuthenticate = require('./lib/socket-io-authenticate');

class Application extends EventEmitter {

  constructor() {
    super();
    this._configure(process.env.NODE_ENV);

    const broker = this.broker = this._initRabbit();
    const sequelize = this.sequelize = this._initSequelize();
    const koaApp = this.app = this._initKoa(brokerContext, sequelize);
    const server = this.server = this._initServer(koaApp);
    const io = this.io = this._initSocketIO(server);

    this._loadRouters(koaApp);
    this._loadModels(sequelize);
    this._loadModules(this);
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

  _initRabbit() {
    const brokerAddress = this.getConfig('brokerAddress') || 'amqp://127.0.0.1';
    const brokerContext = rabbit.createContext(brokerAddress);
    return brokerContext;
  }

  setContext(key, value) {
    this.app.context[key] = value;
    return this;
  }

  getService(key) {
    return this.app.context[key];
  }

  getContext(key) {
    return this.app.context[key];
  }

  getConfig(key) {
    return nconf.get(key);
  }

  start() {
    const PORT = this.getConfig('port') || 3000;
    return Promise.all([
      new Promise((resolve, reject) => {
        try {
          this.server.listen(PORT, () => {
            this.emit('startup');
            resolve();
          });
        } catch(err) {
          reject(err);
        }
      }),
      new Promise((resolve, reject) => {
        this.broker.on('ready', resolve);
        this.broker.on('error', reject);
      });
    ]);
  }

  _initKoa(brokerContext, sequelize) {
    const app = koa();

    this.setContext('broker', brokerContext);
    this.setContext('sequelize', sequelize);

    app.use(errorHandler());
    app.use(morgan.middleware('dev'));
    app.use(serveStatic(`${__dirname}/public`));
    app.use(bodyParser());

    return app;
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

    return sequelize;
  }

  _loadModels(sequelize) {
    require('./models').forEach((model) => {
      model(sequelize);
    });
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
