const log4js = require('log4js');

log4js.configure({
    appenders: {
      out: { type: 'stdout' },
      app: { type: 'file', filename: 'logs/access.log' }
    },
    categories: {
      default: { appenders: [ 'out', 'app' ], level: 'debug' }
    }
});

exports.logger = function(name){
  var logger = log4js.getLogger(name);
  return logger;
};