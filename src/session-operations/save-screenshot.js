'use strict';

const fs = require('fs-extra');
const path = require('path');

module.exports = (screenshotsPath) => {
  return (session, fileName) => {
    fs.ensureDirSync(path.resolve(screenshotsPath));
    return session.screenshot(path.join(screenshotsPath, fileName));
  };
};
