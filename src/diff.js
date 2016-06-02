'use strict';

const BlinkDiff = require('blink-diff');
const _ = require('lodash');

module.exports = (imageAPath, imageBPath, imageOutputPath, callback) => {

  const diff = new BlinkDiff({
    imageAPath,
    imageBPath,
    thresholdType: BlinkDiff.THRESHOLD_PERCENT,
    threshold: 0.01,
    hideShift: true,
    imageOutputPath
  });

  diff.run((err, result) => {
    callback(err, _.isUndefined(result) ? undefined : {
      isDifferent: result.differences > 0,
      equality: 100 * (1 - (result.differences/result.dimension))
    });
  });
};