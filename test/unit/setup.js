'use strict';

var expect = require('chai').expect;
var injectr = require('injectr');
var helper = require('../helpers/unit');

describe('setup', function(){

  var initialise;
  beforeEach(function(){
    var Mirror = injectr('../../src/index.js', {
      nightmare: helper.getStubbedNightmare()
    });

    var mirror = new Mirror();

    initialise = function(options){
      return mirror.setup(options);
    };
  });

  describe('when called with not valid urls', function(){

    it('should throw an error', function(){
      var opts = helper.getValidSetupOptions();
      opts.urls = {};

      var execute = function(){ initialise(opts); };

      expect(execute).to.throw('"urls" must have at least 1 children');
    });
  });

  describe('when called with not valid viewports', function(){

    it('should throw an error', function(){
      var opts = helper.getValidSetupOptions();
      opts.viewports = [[0, -100]];

      var execute = function(){ initialise(opts); };

      expect(execute).to.throw('"0" must be larger than or equal to 1');
    });
  });

  describe('when called without selector', function(){

    it('should throw an error', function(){
      var opts = helper.getValidSetupOptions();
      opts.selector = null;

      var execute = function(){ initialise(opts); };

      expect(execute).to.throw('"selector" must be a string');
    });
  });

  describe('when called without transform function', function(){

    it('should throw an error', function(){
      var opts = helper.getValidSetupOptions();
      delete opts.transform;

      var execute = function(){ initialise(opts); };

      expect(execute).to.throw('"transform" is required');
    });
  });

  describe('when transform is a function', function(){

    it('should be valid', function(){
      var opts = helper.getValidSetupOptions();
      opts.transform = function(){ return 'hello'; };

      var sessions = initialise(opts);

      expect(sessions.length).to.equal(1);
    });
  });

  describe('when transform is a string', function(){

    it('should be valid', function(){
      var opts = helper.getValidSetupOptions();
      opts.transform = 'hello';

      var sessions = initialise(opts);

      expect(sessions.length).to.equal(1);
    });
  });

  describe('when called without screenshotsPath', function(){

    it('should throw an error', function(){
      var opts = helper.getValidSetupOptions();
      opts.screenshotsPath = '';

      var execute = function(){ initialise(opts); };

      expect(execute).to.throw('"screenshotsPath" is not allowed to be empty');
    });
  });
});