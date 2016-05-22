'use strict';

const _ = require("underscore");
const co = require('co');
const fs = require('fs');
const nconf = require('nconf');
const mongoose = require('mongoose');
const passport = require('passport');

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
    const Role = models.role;
    const Permission = models.permission;

    Promise.all([
      _.each(models, (model) => {
        return new Promise((resolve, reject) => {
          model.remove(err => {
            if (!err) resolve(false)
          });
        });
      })
    ]).then(() => {
      console.log("All Collections have been removed.");

      let adminPermission = new Permission({
        name: "developer"
      });

      let adminRole = new Role({
        name: "role"
      });
      adminRole.permission.push(adminPermission);

      let adminAccount = new Account({ name: "tosone" });
      adminAccount.role.push(adminRole);

      Promise.all([
        adminPermission.save(),
        adminRole.save(),
        new Promise((resolve, reject) => {
          Account.register(adminAccount, "tosone", (err) => {
            if (!err) resolve(true);
          });
        })
      ]).then(() => {
        console.log("Init succ");
        process.exit(0);
      }).catch((err) => {
        console.log(err);
      });
    })
  }
});


