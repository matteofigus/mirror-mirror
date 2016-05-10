'use strict';

var parseDomain = require('parse-domain');
var _ = require('lodash');

module.exports = function(session, url, headers, cookies){
  if(!!headers && (!!headers.Cookie || !!headers.cookie)){
    throw new Error('Use the cookie option to set the cookie');
  }

  session = session.goto(url, headers || {});

  if(!!cookies){
    _.each(cookies, function(cookie, cookieName){
      var parsed = parseDomain(url);
      session = session.cookies.set({
        name: cookieName,
        value: cookie,
        domain: '.' + parsed.domain + '.' + parsed.tld,
        path: '/'
      });
    });
  }

  return session;
};
