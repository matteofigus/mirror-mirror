'use strict';

const async = require('async');
const Nightmare = require('nightmare');
const path = require('path');
const _ = require('lodash');

const diff = require('./diff');
const executeCommands = require('./session-operations/execute-commands');
const executeTransformation = require('./session-operations/execute-transformation');
const Log = require('./log');
const openUrl = require('./session-operations/open-url');
const sanitiser = require('./sanitiser');
const SaveScreenshot = require('./session-operations/save-screenshot');
const setViewport = require('./session-operations/set-viewport');
const validator = require('./validator');

module.exports = (conf) => {

  let sessions,
      log,
      retries,
      concurrency,
      timeout;

  return {
    setup: (options) => {

      options = sanitiser.sanitiseOptions(options);
      
      const validationResult = validator.validateOptions(options);

      if(!validationResult.isValid){
        throw new Error(validationResult.error);
      }

      sessions = [];
      log = Log(options.debug);
      retries = options.retries;
      concurrency = options.concurrency;
      timeout = options.timeout;
      
      const saveScreenshot = SaveScreenshot(options.screenshotsPath);

      _.each(options.urls, (url, urlDescription) => {
        _.each(options.viewports, (viewport) => {

          const fileNamePrefix = urlDescription + '_' + viewport.join('x') + '_';

          const initialiseSession = () => {
            let session = Nightmare(conf || {});

            session.on('console', (type, message) => log('browser console', 'warn', message));

            session = setViewport(session, viewport);
            session = openUrl(session, url, options.headers, options.cookies);
            session = executeCommands(session, options.before);        
            session = saveScreenshot(session, fileNamePrefix + 'before.png');
            session = executeTransformation(session, options.selector, options.transform);
            session = executeCommands(session, options.after);
            session = saveScreenshot(session, fileNamePrefix + 'after.png');

            return session;
          };

          sessions.push({
            session: initialiseSession,
            attempts: 0,
            options: _.extend(_.clone(options), {
              fileNamePrefix,
              url,
              urlDescription,
              viewport
            })
          });
        });
      });

      return sessions;
    },
    run: (callback) => {

      let succeeded = 0,
          failed = 0,
          different = 0,
          startSession;

      const getSessionDescription = session => `${session.options.url} (${session.options.viewport.join('x')})`;
      const q = async.queue((session, next) => startSession(session, next), concurrency);

      startSession = (session, cb) => {
        const description = getSessionDescription(session);
        log('starting session for url', 'ok', description);

        const newSession = session.session();
        let cbDone = false;

        const retry = () => {
          if(session.attempts < retries){
            session.attempts++;
            log('attempt ' + session.attempts + ' for url', 'warn', session.options.url);
            q.push(session);
          } else {
            failed++;
            log('All Sessions failed for ', 'error', session.options.urlDescription);
            session.failed = true;
          }
          cb();
        };

        setTimeout(() => {
          if(!cbDone){
            cbDone = true;
            retry();
          }
        }, timeout);

        newSession
          .end()
          .then(() => {
            if(!cbDone){
              cbDone = true;
              log('Session completed', 'ok', description);
              succeeded++;
              return cb();
            }
          })
          .catch((error) => {
            if(!cbDone){
              cbDone = true;
              log('Session failed for ' + description, 'error', error);
              retry();
            }
          });
      };

      q.drain = () => {
        if(failed > 0 && succeeded > 0){
          log('Some sessions failed', 'error', 'Screenshots analysis...');
        } else if(failed > 0 && !succeeded){
          log('All sessions failed', 'error', 'Exiting...');
          process.exit(1);
        } else {
          log('All sessions completed', 'ok', 'Screenshot analysis...');
        }

        async.eachSeries(sessions, (session, next) => {
          const basePath = path.resolve(session.options.screenshotsPath, session.options.fileNamePrefix),
                description = getSessionDescription(session);

          if(session.failed){
            session.result = {
              failed: true,
              error: 'All the sessions failed'
            };
            return next();
          }

          let result = {
            after: basePath + 'after.png',
            before: basePath + 'before.png',
            diff: basePath + 'diff.png'
          };

          diff(result.before, result.after, result.diff, (err, comparisonResult) => {
            if(err){
              failed++;
              session.result = {
                failed: true,
                error: err
              };
              return next();
            }

            result = _.extend(result, comparisonResult);

            if(result.isDifferent){
              log('Diff for ' + description, 'error', 'Difference detected');
              different++;
            } else {
              log('Diff for ' + description, 'ok', 'No difference');
            }

            session.result = result;
            next();
          });
        }, () => {
          const error = (!!failed || !!different) ? 'Some sessions failed or difference were detected' : null;
          callback(error, _.map(sessions, 'result'));
        });
      };

      q.push(sessions);
    }
  };
};
