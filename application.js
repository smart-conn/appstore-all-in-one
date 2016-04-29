'use strict';

const nconf = require('nconf');
const EventEmitter = require('events');

class Application extends EventEmitter {

  constructor() {
    super();
    this._configure(process.env.NODE_ENV);

    const sequelize = this.sequelize = this._initSequelize();
    this._loadModels(sequelize);

    const amqp = this.amqp = this._initAMQP();

    const passport = this.passport = this._initPassport();
    const koaApp = this.app = this._initKoa(passport);
    const server = this.server = this._initServer(koaApp);
    this._injectKoaContext(sequelize, amqp, passport, koaApp);

    this._loadRouters(koaApp);
    this._loadModules(this);
  }

  loginCheck(role) {
    const jwt = require('jsonwebtoken');
    const secret = this.getConfig('secret');
    return function* (next) {
      if (this.header && this.header.authorization) {
        let parts = this.header.authorization.split(' ');
        if (parts.length === 2) {
          let scheme = parts[0];
          let credentials = parts[1];
          if (/^Bearer$/i.test(scheme)) {
            try {
              let userScope = jwt.decode(credentials, secret);
              if (userScope.scope.indexOf(role) !== -1) {
                yield next;
              } else {
                console.log("No Authorization.")
              }
            } catch (e) {
              console.log("Bad Authorization.");
            }
          }
        } else {
          console.log('Bad Authorization header format. Format is "Authorization: Bearer <token>"\n')
        }
      } else {
        console.log('Bad Authorization header format. Format is "Authorization: Bearer <token>"\n');
      }
    }
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
    // const LocalStrategy = require('passport-local').Strategy;
    const passport = require('./passport/passport');
    const User = this.getModel('user');

    require("./passport").forEach(function (thirdParty) {
      thirdParty(passport, User);
    });
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
