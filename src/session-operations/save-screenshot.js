'use strict';

var fs = require('fs-extra');
var path = require('path');

module.exports = function(screenshotsPath){
  return function(session, fileName){
    fs.ensureDirSync(path.resolve(screenshotsPath));
    return session.screenshot(path.join(screenshotsPath, fileName));
  };
};
