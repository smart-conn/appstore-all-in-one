'use strict';

require('./application')()
  .start()
  .then(function() {
    console.log('started');
  });
