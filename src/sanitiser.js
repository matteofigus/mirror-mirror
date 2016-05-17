'use strict';

module.exports = {
  sanitiseOptions: function(options){
    options.debug = options.debug || false;
    options.concurrency = options.concurrency || 3;
    options.retries = options.retries || 3;
    options.timeout = options.timeout || 20000;

    return options;
  }
};