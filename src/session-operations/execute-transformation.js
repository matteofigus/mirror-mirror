'use strict';

const _ = require('lodash');

module.exports = (session, selector, transform) => {

  if(!!transform && !!selector){

    const args = { t: transform, s: selector };

    if(_.isFunction(args.t)){
      args.isFunction = true;
      args.t = args.t.toString();
    }

    session = session.evaluate((args) => {
      
      /*eslint-disable */
      if(args.isFunction){
        args.t = new Function('var ____f=(' + args.t + ');return ____f.apply(____f, arguments);');
      }

      var $el = document.querySelector(args.s),
          replacement = args.isFunction ? args.t($el) : args.t;

      $el.outerHTML = replacement;
      
      /*eslint-enable */
    }, args);
  }

  return session;
};
