const fs = require('fs');
const logger = require('../utils/logger').logger('controller');

function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            logger.info(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            if (mapping[url] instanceof Array) {
                logger.warn('add multi router for ' + path);
                router.post(path, mapping[url][0], mapping[url][1]);
            } else {
                router.post(path, mapping[url]);
            }
            logger.info(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('PUT ')) {
            var path = url.substring(4);
            router.put(path, mapping[url]);
            logger.info(`register URL mapping: PUT ${path}`);
        } else if (url.startsWith('DELETE ')) {
            var path = url.substring(7);
            router.del(path, mapping[url]);
            logger.info(`register URL mapping: DELETE ${path}`);
        } else {
            logger.error(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router, dir) {
    fs.readdirSync(dir).filter((f) => {
        return f.endsWith('.js');
    }).forEach((f) => {
        logger.info(`process controller: ${f}...`);
        let mapping = require(dir + '/' + f);
        addMapping(router, mapping);
    });
}

module.exports = function (dir) {
    let router = require('koa-router')();
    addControllers(router, dir);
    return router.routes();
};