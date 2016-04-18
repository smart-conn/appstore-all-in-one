'use strict';

const nconf = require('nconf');
const EventEmitter = require('events');

class Application extends EventEmitter {

  constructor() {
    super();
    this._configure(process.env.NODE_ENV);

    const sequelize = this.sequelize = this._initSequelize();
    this._loadModels(sequelize);

    const koaApp = this.app = this._initKoa();
    const server = this.server = this._initServer(koaApp);
    this._injectKoaContext(sequelize, amqp);
    this._loadRouters(koaApp);

    const amqp = this.amqp = this._initAMQP();
    this._loadModules(this);
  }

  getModel(name) {
    const sequelize = this.getContext('sequelize');
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

  _injectKoaContext(sequelize, amqp) {
    this._setContext('sequelize', sequelize);
    this._setContext('amqp', amqp);
  }

  _initServer(koaApp) {
    const http = require('http');
    const server = http.createServer(koaApp.callback());
    return server;
  }

  _initAMQP() {
    const amqpRPC = require('./lib/amqp-rpc');
    const brokerAddress = this.getConfig('brokerAddress') || 'amqp://127.0.0.1';
    const broker = amqpRPC(brokerAddress);
    return broker;
  }

  _setContext(key, value) {
    this.app.context[key] = value;
    return this;
  }

  _initKoa(passport) {
    const koa = require('koa');
    const session = require('koa-session');
    const bodyParser = require('koa-bodyparser');
    const errorHandler = require('koa-error');
    const morgan = require('koa-morgan');
    const serveStatic = require('koa-static');

    const app = koa();

    app.keys = this.getConfig('keys');

    app.use(errorHandler());
    app.use(morgan.middleware('dev'));
    app.use(serveStatic(`${__dirname}/public`));
    app.use(bodyParser());
    app.use(session(app));
    // TODO: implements app.use(require('./global')) in passport
    app.use(passport.initialize());
    app.use(passport.session());
    return app;
  }

  _initPassport() {
    const LocalStrategy = require('passport-local').Strategy;
    const KoaPassport = require('koa-passport').KoaPassport;
    const passport = new KoaPassport();
    const User = this.getModel('user');

    passport.use(new LocalStrategy(User.createStrategy()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    return passport;
  }

  _initSequelize() {
    const Sequelize = require('sequelize');

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
    require('./models').forEach((modelInitialize) => {
      modelInitialize(sequelize);
    });
    require('./models/_relationships')(sequelize);
  }

  _loadRouters(koaApp) {
    require('./routers').forEach((router) => {
      koaApp.use(router);
    });
  }

  _loadModules(applicationInstance) {
    require('./services').forEach((serviceInitialize) => {
      serviceInitialize(applicationInstance);
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
