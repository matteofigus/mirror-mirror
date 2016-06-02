'use strict';

const sinon = require('sinon');
const _ = require('lodash');

let stubs;

module.exports = {
  getNightmareStubs: () => stubs,
  getPathStubs: () => {
    
    const joinresolve = (a, b) => a + b;

    return { 
      join: joinresolve,
      resolve: joinresolve
    };
  },
  getStubbedNightmare: (err, res) => {
    
    const nightmare = _.clone({
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

    return () => nightmare;
  },
  getValidSetupOptions: () => _.clone({
    urls: { home: 'https://www.google.com' },
    selector: 'head',
    transform: $el => $el.outerHTML,
    screenshotsPath: './screenshots/'
  })
};