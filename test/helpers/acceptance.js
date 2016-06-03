'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

module.exports = {
  fileExists: filePath => fs.existsSync(filePath),
  setupFixturesServer: (callback) => {
    const server = http.createServer((req, res) => {
      
      const filePath = path.join(__dirname, 'static-fixtures' + req.url);
      const mime = req.url.indexOf('.css') >= 0 ? 'text/css' : 'text/html';

      fs.readFile(filePath, (err, content) => {
        if(err){
          res.writeHead(404);
        } else {
          res.writeHead(200, { 'Content-Type': mime + '; charset=utf-8' });
        }

        res.end(content || '');
      });

    }).listen(3030, () => callback(server));
  }
};