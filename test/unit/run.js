'use strict';

var expect = require('chai').expect;
var helper = require('../helpers/unit');
var injectr = require('injectr');
var sinon = require('sinon');
var _ = require('lodash');

describe('run', function(){

  var initialise,
      nightmare,
      diff;

  beforeEach(function(){

    nightmare = helper.getStubbedNightmare(null, 'ok');
    diff = sinon.stub().yields(null, {
      isDifferent: false,
      equality: 100
    });

    var Mirror = injectr('../../src/index.js', { 
      nightmare: nightmare,
      path: helper.getPathStubs(),
      './diff': diff,
      './session-operations/save-screenshot': injectr('../../src/session-operations/save-screenshot.js', {
        path: helper.getPathStubs(),
        'fs-extra': { ensureDirSync: _.noop }
      })
    }, {
      setTimeout: _.noop
    });
  
    var mirror = new Mirror();

    initialise = function(options){
      mirror.setup(options);
      return mirror;
    };
  });

  describe('when running the sessions', function(){

    var error, result, stubs;
    beforeEach(function(done){
      var opts = helper.getValidSetupOptions(),
          mirror = initialise(opts);

      mirror.run(function(err, res){
        error = err;
        result = res;
        stubs = helper.getNightmareStubs();
        done();
      });
    });

    it('should call the nightmare goto with the correct urls', function(){
      expect(stubs.goto.args[0][0]).to.eql('https://www.google.com');
    });

    it('should call the nigthmare screenshot with the correct fileNames and paths', function(){
      expect(stubs.screenshot.args[0][0]).to.equal('./screenshots/home-before.png');
      expect(stubs.screenshot.args[1][0]).to.equal('./screenshots/home-after.png');
    });

    it('should compare the screenshots and save the diff', function(){
      expect(diff.args[0][0]).to.equal('./screenshots/home-before.png');
      expect(diff.args[0][1]).to.equal('./screenshots/home-after.png');
      expect(diff.args[0][2]).to.equal('./screenshots/home-diff.png');
    });

    it('should not error', function(){
      expect(error).to.be.null;
    });

    it('should return a result', function(){
      expect(result).to.eql([{
        after: './screenshots/home-after.png',
        before: './screenshots/home-before.png',
        diff: './screenshots/home-diff.png',
        isDifferent: false,
        equality: 100
      }]);
    });
  });
});