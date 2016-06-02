'use strict';

const joi = require('joi');

module.exports = {
  validateOptions: (options) => {

    const schema = {
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
      urls: joi.object().required().min(1),
      viewports: joi.array().items(joi.array().items(joi.number().integer().min(1)))
    };

    const result = joi.validate(options, schema);

    return {
      isValid: !result.error,
      error: result.error || undefined
    };
  }
};