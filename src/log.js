'use strict';

var colors = require('colors/safe');

module.exports = function(debug){
  return function(eventName, type, message){
    if(!!debug){

      var colour = {
        error: 'red',
        warn: 'yellow',
        ok: 'green'
      }[type] || 'green';

      console.log(colors[colour](eventName + ' » ') + message);
    }
  };
};
