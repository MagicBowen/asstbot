const logger = require('../utils/logger').logger('server');

module.exports = () => {
    return async (ctx, next) => {
        logger.debug(`process request for '${ctx.request.method} ${ctx.request.url}' ...`);
        var start = new Date().getTime();
        await next();
        var execTime = new Date().getTime() - start;
        ctx.response.set('X-Response-Time', `${execTime}ms`); 
        logger.debug(`... response in duration ${execTime}ms`);
    }
}
