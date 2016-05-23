'use strict';

module.exports = function(session, viewport){
  return session.viewport(viewport[0], viewport[1]);
};
