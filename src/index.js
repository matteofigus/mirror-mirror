'use strict';

var colors = require('colors/safe');
var Nightmare = require('nightmare');
var path = require('path');
var _ = require('lodash');

var diff = require('./diff');
var eachAsync = require('./utils').eachAsync;
var executeCommands = require('./session-operations/execute-commands');
var executeTransformation = require('./session-operations/execute-transformation');
var Log = require('./log');
var openUrl = require('./session-operations/open-url');
var SaveScreenshot = require('./session-operations/save-screenshot');

module.exports = function(conf){

  var sessions, log;

  return {
    setup: function(options){

      sessions = [];
      log = new Log(options.debug);
      
      var saveScreenshot = new SaveScreenshot(options.screenshotsPath);

      _.each(options.urls, function(url, urlDescription){

        var initialiseSession = function(){
          var session = Nightmare(conf || {});

          session.on('console', function(type, message){
            log('browser console', 'warn', message);
          });

          session = openUrl(session, url, options.headers, options.cookies);
          session = executeCommands(session, options.before);        
          session = saveScreenshot(session, urlDescription + '-before.png');
          session = executeTransformation(session, options.selector, options.transform);
          session = executeCommands(session, options.after);
          session = saveScreenshot(session, urlDescription + '-after.png');

          return session;
        };

        sessions.push({
          options: _.extend(_.clone(options), { url: url, urlDescription: urlDescription }),
          session: initialiseSession,
          attempts: 0
        });
      });

    },
    run: function(callback){

      var succeeded = 0,
          failed = 0,
          different = 0;

      eachAsync(sessions, function(session, next){

        var startSession = function(cb){
          log('starting session for url', 'ok', session.options.url);
          var newSession = session.session();

          newSession
            .end()
            .then(function(){
              log('Session completed', 'ok', session.options.url);
              succeeded++;
              return cb();
            })
            .catch(function(error){
              log('Session failed for ' + session.options.urlDescription, 'error', error);

              if(session.attempts < 3){
                session.attempts++;
                log('attempt ' + session.attempts + ' for url', 'warn', session.options.url);
                startSession(cb);
              } else {
                failed++;
                log('All Sessions failed for ', 'error', session.options.urlDescription);
                session.failed = true;
                return cb();
              }
            });
        };

        startSession(next);
      }, function(){
        if(failed > 0 && succeeded > 0){
          log('Some sessions failed', 'error', 'Screenshots analysis...');
        } else if(failed > 0 && !succeeded){
          log('All sessions failed', 'error', 'Exiting...');
          process.exit(1);
        } else {
          log('All sessions completed', 'ok', 'Screenshot analysis...');
        }

        eachAsync(sessions, function(session, next){
          var basePath = path.resolve(session.options.screenshotsPath, session.options.urlDescription);

          if(session.failed){
            session.result = {
              failed: true,
              error: 'All the sessions failed'
            };
            return next();
          }

          var result = {
            after: basePath + '-after.png',
            before: basePath + '-before.png',
            diff: basePath + '-diff.png'
          };

          diff(result.before, result.after, result.diff, function(err, diffMetric){
            if(err){
              failed++;
              session.result = {
                failed: true,
                error: err
              };
              return next();
            }

            result.isDifferent = diffMetric === 1;

            if(result.isDifferent){
              log('Diff for ' + session.options.urlDescription, 'error', 'Difference detected');
              different++;
            } else {
              log('Diff for ' + session.options.urlDescription, 'ok', 'No difference');
            }

            session.result = result;
            next();
          });
        }, function(){
          var error = (!!failed || !!different) ? 'Some sessions failed or difference were detected' : null;
          callback(error, _.map(sessions, 'result'));
        });
      });
    }
  };
};
