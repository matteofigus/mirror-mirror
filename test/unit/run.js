'use strict';

const expect = require('chai').expect;
const helper = require('../helpers/unit');
const injectr = require('injectr');
const sinon = require('sinon');
const _ = require('lodash');

describe('run', () => {

  let initialise,
      nightmare,
      diff;

  beforeEach(() => {

    nightmare = helper.getStubbedNightmare(null, 'ok');
    diff = sinon.stub().yields(null, {
      isDifferent: false,
      equality: 100
    });

    const Mirror = injectr('../../src/index.js', { 
      nightmare,
      path: helper.getPathStubs(),
      './diff': diff,
      './session-operations/save-screenshot': injectr('../../src/session-operations/save-screenshot.js', {
        path: helper.getPathStubs(),
        'fs-extra': { ensureDirSync: _.noop }
      })
    }, {
      setTimeout: _.noop
    });
  
    const mirror = Mirror();

    initialise = (options) => {
      mirror.setup(options);
      return mirror;
    };
  });

  describe('when running the sessions', () => {

    let error, result, stubs;
    beforeEach((done) => {
      const opts = helper.getValidSetupOptions(),
            mirror = initialise(opts);

      mirror.run((err, res) => {
        error = err;
        result = res;
        stubs = helper.getNightmareStubs();
        done();
      });
    });

    it('should call the nightmare goto with the correct urls', () => {
      expect(stubs.goto.args[0][0]).to.eql('https://www.google.com');
    });

    it('should call the nightmare viewport with the correct resolution', () => {
      expect(stubs.viewport.args[0]).to.eql([800, 600]);
    });

    it('should call the nightmare screenshot with the correct fileNames and paths', () => {
      expect(stubs.screenshot.args[0][0]).to.equal('./screenshots/home_800x600_before.png');
      expect(stubs.screenshot.args[1][0]).to.equal('./screenshots/home_800x600_after.png');
    });

    it('should compare the screenshots and save the diff', () => {
      expect(diff.args[0][0]).to.equal('./screenshots/home_800x600_before.png');
      expect(diff.args[0][1]).to.equal('./screenshots/home_800x600_after.png');
      expect(diff.args[0][2]).to.equal('./screenshots/home_800x600_diff.png');
    });

    it('should not error', () => {
      expect(error).to.be.null;
    });

    it('should return a result', () => {
      expect(result).to.eql([{
        after: './screenshots/home_800x600_after.png',
        before: './screenshots/home_800x600_before.png',
        diff: './screenshots/home_800x600_diff.png',
        isDifferent: false,
        equality: 100
      }]);
    });
  });
});