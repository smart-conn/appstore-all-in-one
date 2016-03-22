var context = require('rabbit.js').createContext();

var req = context.socket('REQ');
var rep = context.socket('REP');

req.connect('test', function() {
  rep.connect('test', function() {

    req.write(JSON.stringify({a: 1}));

    req.on('data', function(msg) {
      console.log('received response', msg.toString());
    });

    rep.on('data', function(msg) {
      console.log('received request', msg.toString());
      rep.write(JSON.stringify({ok: true}));
    });

  });
});
