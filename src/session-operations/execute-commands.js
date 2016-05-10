'use strict';

module.exports = function(session, commands){
  if(!!commands)
    for(var i = 0; i < commands.length; i++)
      session = commands[i](session);

  return session;
};