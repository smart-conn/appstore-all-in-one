const _ = require('underscore');

module.exports = function(app) {

  const io = app.getContext('io');

  io.of('/nasc').use(function(socket, next) {
    io.of('/admin').emit('update');
    socket.on('disconnect', function() {
      io.of('/admin').emit('update');
    });
    next();
  });

  io.of('/admin').use(function(socket, next) {
    socket.on('findAll', function(callback) {
      callback(null, listAllSockets(io.of('/nasc')));
    });
    next();
  });

};

function listAllSockets(namespace) {
  var connected = namespace.connected;
  return _.map(connected, function(socket) {
    return {
      id: socket.id,
      rooms: Object.keys(socket.rooms)
    };
  });
}
