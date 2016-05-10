'use strict';

var _ = require('lodash');

module.exports = {
  eachAsync: function(obj, fn, cb){
    var c = obj.length;
    
    var next = function(){
      c--;
      if(c === 0){ 
        var a = cb;
        cb = _.noop;
        return a();
      }
    };

    _.each(obj, function(el){
      fn(el, next);
    });
  }
};
