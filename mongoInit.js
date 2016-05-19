'use strict';

const Promise = require('bluebird');
const fs = require('fs');
const nconf = require('nconf');
const Sequelize = require('sequelize');
const mongoose = require('mongoose');
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const NODE_ENV = process.env.NODE_ENV || 'development';
nconf.argv().env();
nconf.file(`config.${NODE_ENV}.json`);

require('./mongoModels')(mongoose);
mongoose.connect(nconf.get("mongodb"), err => {
  if (err) console.log("MongoDB Connect Error:" + err);
  else {
    console.log("MongoDB Connect Succ.");


    const models = mongoose.models;
    const Account = models.account;
    
    Account.register(new Account({ name: "tosone" }), "tosone", err => {
      if (err) console.log(err);
      else console.log("succ");
    });

  }
});


