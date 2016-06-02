'use strict';

const colors = require('colors/safe');

module.exports = (debug) => {
  return (eventName, type, message) => {
    if(debug){

      const colour = {
        error: 'red',
        warn: 'yellow',
        ok: 'green'
      }[type] || 'green';

      console.log(colors[colour](eventName + ' » ') + message);
    }
  };
};
