'use strict';

var sinon = require('sinon');
var _ = require('lodash');

var stubs;

module.exports = {
  getNightmareStubs: function(){
    return stubs;
  },
  getPathStubs: function(){
    var joinresolve = function(a, b){ return a + b; };
    return { 
      join: joinresolve,
      resolve: joinresolve
    };
  },
  getStubbedNightmare: function(err, res){
    
    var nightmare = _.clone({
      catch: sinon.stub(),
      cookies: { set: sinon.stub() },
      end: sinon.stub(),
      evaluate: sinon.stub(),
      goto: sinon.stub(),
      on: sinon.stub(),
      screenshot: sinon.stub(),
      then: sinon.stub(),
      viewport: sinon.stub()
    });

    nightmare.cookies.set.returns(nightmare);
    nightmare.end.returns(nightmare);
    nightmare.evaluate.returns(nightmare);
    nightmare.goto.returns(nightmare);
    nightmare.on.returns(nightmare);
    nightmare.screenshot.returns(nightmare);
    nightmare.then.returns(nightmare).yields(res);
    nightmare.viewport.returns(nightmare);

    stubs = nightmare;

    return function(){
      return nightmare;
    };
  },
  getValidSetupOptions: function(){
    return _.clone({
      urls: {
        home: 'https://www.google.com'
      },
      selector: 'head',
      transform: function($el){
        return $el.outerHTML;
      },
      screenshotsPath: './screenshots/'
    });
  }
};