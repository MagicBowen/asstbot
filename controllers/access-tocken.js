const accessTocken = require('../utils/access-tocken');
const logger = require('../utils/logger').logger('controller_access_tocken');

async function getAccessTocken(ctx) {
    try {
        const tocken = await accessTocken.getTocken();
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {tocken : tocken};
    } catch(err) {
        ctx.response.status = 404;
        logger.error('get access tocken failed: ' + err);
    }
}

module.exports = {
    'GET /tocken' : getAccessTocken
}