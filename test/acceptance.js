'use strict';

const expect = require('chai').expect;
const helper = require('./helpers/acceptance');
const Mirror = require('../');

describe('e2e acceptance', () => {

  let server;
  before((done) => {
    helper.setupFixturesServer((fixturesServer) => {
      server = fixturesServer;
      done();
    });
  });

  after(done => server.close(done));

  describe('when swapping a css file from a page', () => {

    describe('when changing visuals', () => {
      
      let error, result;

      before((done) => {

        const mirror = Mirror();

        mirror.setup({
          urls: { test: 'http://localhost:3030/example.html' },
          selector: 'link',
          transform: () => '<link rel="stylesheet" type="text/css" href="example2.css">',
          screenshotsPath: './screenshots'
        });

        mirror.run((err, res) => {
          error = err;
          result = res;
          done();
        });
      });

      it('should return an error', () => {
        expect(error).to.be.equal('Some sessions failed or difference were detected');
      });

      it('should detect difference', () => {
        expect(result[0].isDifferent).to.be.true;
      });

      it('should show difference percentage', () => {
        expect(result[0].equality).to.be.below(100);
      });

      it('should save all the screenshots', () => {
        expect(helper.fileExists(result[0].after)).to.be.true;
        expect(helper.fileExists(result[0].before)).to.be.true;
        expect(helper.fileExists(result[0].diff)).to.be.true;
      });
    });

    describe('when not changing visuals', () => {
      
      let error, result;

      before((done) => {

        const mirror = Mirror();

        mirror.setup({
          urls: { test: 'http://localhost:3030/example.html' },
          selector: 'link',
          transform: () => '<link rel="stylesheet" type="text/css" href="example.css">',
          screenshotsPath: './screenshots'
        });

        mirror.run((err, res) => {
          error = err;
          result = res;
          done();
        });
      });

      it('should not return an error', () => {
        expect(error).to.be.null;
      });

      it('should detect images are not different', () => {
        expect(result[0].isDifferent).to.be.false;
      });

      it('should show equality percentage 100%', () => {
        expect(result[0].equality).to.be.equal(100);
      });

      it('should save all the screenshots', () => {
        expect(helper.fileExists(result[0].after)).to.be.true;
        expect(helper.fileExists(result[0].before)).to.be.true;
        expect(helper.fileExists(result[0].diff)).to.be.true;
      });
    });
  });
});