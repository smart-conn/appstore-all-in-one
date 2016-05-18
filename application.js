'use strict';

const nconf = require('nconf');
const EventEmitter = require('events');

class Application extends EventEmitter {

  constructor() {
    super();
    this._configure(process.env.NODE_ENV);

    const sequelize = this.sequelize = this._initSequelize();
    const mongoose = this._initMongo();
    this._loadModels(sequelize);

    const amqp = this.amqp = this._initAMQP();

    const passport = this.passport = this._initPassport();
    const koaApp = this.app = this._initKoa(passport);
    const server = this.server = this._initServer(koaApp);
    this._injectKoaContext(sequelize, amqp, passport, koaApp);

    this._loadRouters(this);
    this._loadModules(this);
  }

  //权限检查
  authCheck(role) {
    return require('./lib/authCheck')(role, this.getConfig('secret'));
  }

  getModel(name) {
    const sequelize = this.sequelize;
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

  _injectKoaContext(sequelize, amqp, passport, koaApp) {
    this._setContext('sequelize', sequelize);
    this._setContext('amqp', amqp);
    this._setContext('passport', passport);
    this._setContext('koa', koaApp);
  }

  _initMongo() {
    const mongoose = require('mongoose');
    mongoose.connect(this.getConfig("mongodb"));
    require('./mongoModels')(mongoose);
    return mongoose;
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
    const bodyParser = require('koa-bodyparser');
    const errorHandler = require('koa-error');
    const morgan = require('koa-morgan');
    const compress = require('koa-compress');
    const cors = require('kcors');
    const serveStatic = require('koa-static');
    const path = require('path');

    const app = koa();

    app.use(cors());
    app.use(compress({
      threshold: 2048
    }));
    app.use(errorHandler());
    app.use(morgan.middleware('dev'));
    app.use(serveStatic(path.join(__dirname, 'public')));
    app.use(bodyParser());
    // TODO: implements app.use(require('./global')) in passport
    app.use(passport.initialize());
    return app;
  }

  _initPassport() {
    const KoaPassport = require('koa-passport').KoaPassport;
    const passport = new KoaPassport();
    const Account = this.getModel('account');
    passport.use(Account.createStrategy());
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
    require('./models')(sequelize);
  }

  _loadRouters(applicationInstance) {
    require('./routers')(applicationInstance);
  }

  _loadModules(applicationInstance) {
    require('./services')(applicationInstance);
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
