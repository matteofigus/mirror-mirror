'use strict';

var colors = require('colors/safe');
var fs = require('fs');
var PNGDiff = require('png-diff');

module.exports = function(before, after, diffFile, callback){
  var image2Stream = fs.createReadStream(after);
  PNGDiff.outputDiff(before, image2Stream, diffFile, false , function(err, diffMetric){
    callback(err, diffMetric ? diffMetric === 1 : undefined);
  });
};
