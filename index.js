'use strict';

const app = require('./application')()

app.start()
  .then(function() {
    console.log('started');
  });
