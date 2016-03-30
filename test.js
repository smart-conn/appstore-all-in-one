"use strict";

var Application = require('./application');
var Promise = require('bluebird');

var app = new Application();

var DeviceModel = app.getModel('deviceModel');
var ApplicationPackage = app.getModel('appPackage');
var appID = 'MzFiY2YxZGItMGQ0Mi00NDY5LTlkYjAtYWZlYjlhYTg0MTQ1';

function test(deviceModels) {

  return Promise.all(deviceModels.map(function (deviceModel) {
    //availablePackageWithDeviceModel:对于某设备型号可用的appPackage
    return DeviceModel.findOne({
      where: {
        id: deviceModel.id
      },
      include: [{
        model: ApplicationPackage,
        where: {
          appID: appID
        }
      }]
    }).then(function (availablePackageWithDeviceModel) {
      if (availablePackageWithDeviceModel) {
        if (availablePackageWithDeviceModel.appPackages) {
          return availablePackageWithDeviceModel.appPackages.map(function (item) {
            return {
              id: item.id,
              version: item.version
            };
          }).sort(function (a, b) {
            return a.id < b.id
          })[0];
        } else {
          console.log("设备不可以装这个app");
          return false;
        }
      } else {
        console.log("用户查询了一个非法设备");
        return false;
      }
    });
  })).then((canInstall) => {
    deviceModels.forEach(function (deviceModel) {
      deviceModel.canInstall = canInstall;
    });
    console.log("12312313tosone");
    return deviceModels;
  });

}

test([{
  id: 1
}, {
  id: 2
}]).then(console.log.bind(console)).catch(console.log.bind(console));
