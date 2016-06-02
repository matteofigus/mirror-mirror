'use strict';

module.exports = (session, commands) => {
  if(commands){
    for(let i = 0; i < commands.length; i++){
      session = commands[i](session);
    }
  }

  return session;
};