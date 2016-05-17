'use strict';

var joi = require('joi');

module.exports = {
  validateOptions: function(options){

    var schema = {
      after: joi.array().items(joi.func()),
      before: joi.array().items(joi.func()),
      concurrency: joi.number().required(),
      cookies: joi.object(),
      debug: joi.boolean(),
      headers: joi.object(),
      retries: joi.number().required(),
      selector: joi.string().required(),
      screenshotsPath: joi.string().required(),
      timeout: joi.number().required(),
      transform: joi.alternatives().try(joi.func(), joi.string()).required(),
      urls: joi.object().required().min(1)
    };

    var result = joi.validate(options, schema);

    return {
      isValid: !result.error,
      error: result.error || undefined
    };
  }
};