'use strict';

const _ = require('underscore');
const jwt = require('jsonwebtoken');

const repo = [
  {
    id: 'NGYxNTg2ODMtY2U2NS00Y2FiLTljYmQtZDI1ZGY3YWMwMDdj',
    name: '变声',
    version: '0.0.1',
    flow: [{"id":"3367e45f.cc981c","type":"function","name":"++","func":"if ( (msg.i += 1) < msg.items.length ) return msg;\n","outputs":1,"x":376,"y":268,"z":"886b17b1.7794e8","wires":[["116d5bb3.ee92a4"]]},{"id":"116d5bb3.ee92a4","type":"function","name":"for each item","func":"if( msg.i     == undefined ) msg.i = 0;\nif( msg.items == undefined ) msg.items = msg.payload;\n\nmsg.payload = msg.items[ msg.i ];\n\nreturn msg;","outputs":1,"x":378,"y":240,"z":"886b17b1.7794e8","wires":[["3367e45f.cc981c","92f7e57c.6d0818"]]}]
  },
  {
    id: 'NGYxNTg2ODMtY2U2NS00Y2FiLTljYmQtZDI1ZGY3YWMwMDdj',
    name: '变声',
    version: '0.0.2',
    flow: [{"id":"3367e45f.cc981c","type":"function","name":"++","func":"if ( (msg.i += 1) < msg.items.length ) return msg;\n","outputs":1,"x":376,"y":268,"z":"886b17b1.7794e8","wires":[["116d5bb3.ee92a4"]]},{"id":"116d5bb3.ee92a4","type":"function","name":"for each item","func":"if( msg.i     == undefined ) msg.i = 0;\nif( msg.items == undefined ) msg.items = msg.payload;\n\nmsg.payload = msg.items[ msg.i ];\n\nreturn msg;","outputs":1,"x":378,"y":240,"z":"886b17b1.7794e8","wires":[["3367e45f.cc981c","92f7e57c.6d0818"]]}]
  },
  {
    id: 'MzFiY2YxZGItMGQ0Mi00NDY5LTlkYjAtYWZlYjlhYTg0MTQ1',
    name: '电话本',
    version: '0.0.1',
    flow: [{"id":"3012f18f.cfed0e","type":"inject","name":"basic inject","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":180.0994415283203,"y":190.09091186523438,"z":"fe309029.01cf7","wires":[["b7f4e964.480b18"]]},{"id":"b7f4e964.480b18","type":"debug","name":"","active":true,"console":"false","complete":"false","x":393.0994415283203,"y":233.09091186523438,"z":"fe309029.01cf7","wires":[]}]
  },
  {
    id: 'ZTZkYWE5NzUtYzU4MC00MGY2LTgwNTAtYzBkYTkyN2Q4ZjFk',
    name: 'UUID 生成器',
    version: '0.0.1',
    flow: [{"id":"3b911b0e.c46ee4","type":"http in","name":"Home_Page","url":"/Home_Page","method":"get","x":209.88888549804688,"y":111.88888549804688,"z":"3595e52c.ca6a1a","wires":[["257231d0.da8dce"]]},{"id":"257231d0.da8dce","type":"template","name":"","template":"<!DOCTYPE html> \n<html>\n<head>\n\t<title>Page Title</title>\n\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n\t<link rel=\"stylesheet\" href=\"http://code.jquery.com/mobile/1.4.0/jquery.mobile-1.4.0.min.css\" />\n<script src=\"http://code.jquery.com/jquery-1.9.1.min.js\"></script>\n<script src=\"http://code.jquery.com/mobile/1.4.0/jquery.mobile-1.4.0.min.js\"></script>\n</head>\n\n<body>\n<!-- Start of first page: #one -->\n<div data-role=\"page\" id=\"one\">\n\n\t<div data-role=\"header\">\n\t\t<h1>Multi-page</h1>\n\t</div><!-- /header -->\n\n\t<div role=\"main\" class=\"ui-content\" >\n\t\t<h2>One</h2>\n\n\t\t<p>I have an <code>id</code> of \"one\" on my page container. I'm first in the source order so I'm shown when the page loads.</p>\n\n\t\t<p>This is a multi-page boilerplate template that you can copy to build your first jQuery Mobile page. This template contains multiple \"page\" containers inside, unlike a single page template that has just one page within it.</p>\n\t\t<p>Just view the source and copy the code to get started. All the CSS and JS is linked to the jQuery CDN versions so this is super easy to set up. Remember to include a meta viewport tag in the head to set the zoom level.</p>\n\t\t<p>You link to internal pages by referring to the <code>id</code> of the page you want to show. For example, to <a href=\"#two\" >link</a> to the page with an <code>id</code> of \"two\", my link would have a <code>href=\"#two\"</code> in the code.</p>\n\n\t\t<h3>Show internal pages:</h3>\n\t\t<p><a href=\"#two\" class=\"ui-btn ui-shadow ui-corner-all\">Show page \"two\"</a></p>\n\t\t<p><a href=\"#popup\" class=\"ui-btn ui-shadow ui-corner-all\" data-rel=\"dialog\" data-transition=\"pop\">Show page \"popup\" (as a dialog)</a></p>\n\t</div><!-- /content -->\n\n\t<div data-role=\"footer\" data-theme=\"a\">\n\t\t<h4>Page Footer</h4>\n\t</div><!-- /footer -->\n</div><!-- /page one -->\n\n<!-- Start of second page: #two -->\n<div data-role=\"page\" id=\"two\" data-theme=\"a\">\n\n\t<div data-role=\"header\">\n\t\t<h1>Two</h1>\n\t</div><!-- /header -->\n\n\t<div role=\"main\" class=\"ui-content\">\n\t\t<h2>Two</h2>\n\t\t<p>I have an id of \"two\" on my page container. I'm the second page container in this multi-page template.</p>\n\t\t<p>Notice that the theme is different for this page because we've added a few <code>data-theme</code> swatch assigments here to show off how flexible it is. You can add any content or widget to these pages, but we're keeping these simple.</p>\n\t\t<p><a href=\"#one\" data-direction=\"reverse\" class=\"ui-btn ui-shadow ui-corner-all ui-btn-b\">Back to page \"one\"</a></p>\n\n\t</div><!-- /content -->\n\n\t<div data-role=\"footer\">\n\t\t<h4>Page Footer</h4>\n\t</div><!-- /footer -->\n</div><!-- /page two -->\n\n<!-- Start of third page: #popup -->\n<div data-role=\"page\" id=\"popup\">\n\n\t<div data-role=\"header\" data-theme=\"b\">\n\t\t<h1>Dialog</h1>\n\t</div><!-- /header -->\n\n\t<div role=\"main\" class=\"ui-content\">\n\t\t<h2>Popup</h2>\n\t\t<p>I have an id of \"popup\" on my page container and only look like a dialog because the link to me had a <code>data-rel=\"dialog\"</code> attribute which gives me this inset look and a <code>data-transition=\"pop\"</code> attribute to change the transition to pop. Without this, I'd be styled as a normal page.</p>\n\t\t<p><a href=\"#one\" data-rel=\"back\" class=\"ui-btn ui-shadow ui-corner-all ui-btn-inline ui-icon-back ui-btn-icon-left\">Back to page \"one\"</a></p>\n\t</div><!-- /content -->\n\n\t<div data-role=\"footer\">\n\t\t<h4>Page Footer</h4>\n\t</div><!-- /footer -->\n</div><!-- /page popup -->\n</body>\n\n\n\n\n\n</html>","x":450.8888854980469,"y":96.88888549804688,"z":"3595e52c.ca6a1a","wires":[["e4fbc5c7.1b0438"]]},{"id":"e4fbc5c7.1b0438","type":"http response","name":"","x":655.8888854980469,"y":141.88888549804688,"z":"3595e52c.ca6a1a","wires":[]}]
  }
];

const manifest = [
  {
    id: 'MzFiY2YxZGItMGQ0Mi00NDY5LTlkYjAtYWZlYjlhYTg0MTQ1',
    name: '电话本',
    version: '0.0.1'
  }
];

module.exports = function(app) {

  const broker = app.getService('broker');
  const worker = broker.socket('SUB');

  worker.connect('app.install');

  amqp.on('app.install', (msg, callback) => {
    console.log(msg);
    amqp.call('notify.app.install', msg);
    return callback();
  });

  amqp.on('app.uninstall', (msg, callback) => {
    amqp.call('notify.app.uninstall', msg);
    return callback();
  });

  amqp.on('app.update', (msg, callback) => {
    const id = msg.id;
    const version = msg.version;

    findAllAliasWithId(id).then((alias) => {
      amqp.call('notify.app.install', {id, alias, version});
    });
    return callback();
  });

  /**
   * get package from repo
   *
   * request format:
   * ```
   * {
   *   "packageAtVersion": "string"
   * }
   * ```
   *
   * response format:
   * ```
   * {
   *   "id": "string",
   *   "name": "string",
   *   "version": "string",
   *   "flow": "json"
   * }
   * ```
   */
  amqp.on('get.package', (msg, callback) => {
    const packageAtVersion = msg.packageAtVersion;
    console.log(packageAtVersion);

    const packageInfo = packageAtVersion.split('@');
    const id = packageInfo[0];
    const version = packageInfo[1];

    getPackage(id, version).then((appInfo) => {
      callback(null, appInfo);
    });
  });

  amqp.on('get.manifest', (msg, callback) => {
    const alias = msg.alias;

    getManifest().then((manifest) => {
      callback(null, manifest);
    });
  });

  amqp.on('device.bind', (msg, callback) => {
    const alias = msg.alias;
    const userId = msg.userId;

    issueAccessToken(userId, alias).then((accessToken) => {
      callback(null, {accessToken});
    });

  });

  function findAllAliasWithId(id) {
    return Promise.resolve(['54321']);
  }

  function getManifest() {
    return Promise.resolve(manifest);
  }

  function getPackage(id, version) {
    if (!version) {
      var packages = _.sortBy(_.filter(repo, (item) => {
        return item.id === id;
      }), 'version');
      return Promise.resolve(packages[0]);
    }
    return Promise.resolve(_.find(repo, function(item) {
      return item.id === id && item.version === version;
    }));
  }

  function issueAccessToken(userId, alias) {
    return Promise.resolve(jwt.sign({alias}, 'secret', {
      subject: userId,
    }));
  }

};
