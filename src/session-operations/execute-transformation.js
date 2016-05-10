'use strict';

var _ = require('lodash');

module.exports = function(session, selector, transform){

  if(!!transform && !!selector){

    var args = { t: transform, s: selector };

    if(_.isFunction(args.t)){
      args.isFunction = true;
      args.t = args.t.toString();
    }

    session = session.evaluate(function(args){

      if(args.isFunction){
        args.t = new Function('var ____f=(' + args.t + ');return ____f.apply(____f, arguments);'); // jshint ignore:line
      }

      var $el = document.querySelector(args.s),
          replacement = args.isFunction ? args.t($el) : args.t;

      $el.outerHTML = replacement;
    }, args);
  }

  return session;
};
