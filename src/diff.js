'use strict';

var BlinkDiff = require('blink-diff');
var _ = require('lodash');

module.exports = function(before, after, diffFile, callback){

  var diff = new BlinkDiff({
    imageAPath: before,
    imageBPath: after,
    thresholdType: BlinkDiff.THRESHOLD_PERCENT,
    threshold: 0.01,
    hideShift: true,
    imageOutputPath: diffFile
  });

  diff.run(function(err, result){
    callback(err, _.isUndefined(result) ? undefined : {
      isDifferent: result.differences > 0,
      equality: 100 * (1 - (result.differences/result.dimension))
    });
  });
};