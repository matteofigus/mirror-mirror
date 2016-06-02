'use strict';

const _ = require('lodash');

module.exports = {
  sanitiseOptions: (options) => {
    options.debug = options.debug || false;
    options.concurrency = options.concurrency || 3;
    options.retries = options.retries || 3;
    options.timeout = options.timeout || 20000;

    options.viewports = options.viewports || [];

    if(_.isEmpty(options.viewports)){
      options.viewports.push([800, 600]);
    }

    return options;
  }
};