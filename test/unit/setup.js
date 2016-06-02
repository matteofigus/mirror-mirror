'use strict';

const expect = require('chai').expect;
const injectr = require('injectr');
const helper = require('../helpers/unit');

describe('setup', () => {

  let initialise;
  beforeEach(() => {
    const Mirror = injectr('../../src/index.js', {
      nightmare: helper.getStubbedNightmare()
    });

    const mirror = Mirror();

    initialise = options => mirror.setup(options);
  });

  describe('when called with not valid urls', () => {

    it('should throw an error', () => {
      let opts = helper.getValidSetupOptions();
      opts.urls = {};

      const execute = () => initialise(opts);

      expect(execute).to.throw('"urls" must have at least 1 children');
    });
  });

  describe('when called with not valid viewports', () => {

    it('should throw an error', () => {
      let opts = helper.getValidSetupOptions();
      opts.viewports = [[0, -100]];

      const execute = () => initialise(opts);

      expect(execute).to.throw('"0" must be larger than or equal to 1');
    });
  });

  describe('when called without selector', () => {

    it('should throw an error', () => {
      let opts = helper.getValidSetupOptions();
      opts.selector = null;

      const execute = () => initialise(opts);

      expect(execute).to.throw('"selector" must be a string');
    });
  });

  describe('when called without transform function', () => {

    it('should throw an error', () => {
      let opts = helper.getValidSetupOptions();
      delete opts.transform;

      const execute = () => initialise(opts);

      expect(execute).to.throw('"transform" is required');
    });
  });

  describe('when transform is a function', () => {

    it('should be valid', () => {
      let opts = helper.getValidSetupOptions();
      opts.transform = () => 'hello';

      const sessions = initialise(opts);

      expect(sessions.length).to.equal(1);
    });
  });

  describe('when transform is a string', () => {

    it('should be valid', () => {
      let opts = helper.getValidSetupOptions();
      opts.transform = 'hello';

      const sessions = initialise(opts);

      expect(sessions.length).to.equal(1);
    });
  });

  describe('when called without screenshotsPath', () => {

    it('should throw an error', () => {
      let opts = helper.getValidSetupOptions();
      opts.screenshotsPath = '';

      const execute = () => initialise(opts);

      expect(execute).to.throw('"screenshotsPath" is not allowed to be empty');
    });
  });
});