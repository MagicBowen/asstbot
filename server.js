const Koa = require('koa');
const serve = require('koa-static');
const koaBody = require('koa-body');
const views = require('koa-views');
const session = require('koa-session');

const responseTime = require('./middlewares/response-time');
const controllerRouter = require('./middlewares/controller-router');
const logger = require('./utils/logger').logger('server');

///////////////////////////////////////////////////////////
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 8000;
const host = process.env.HOST || '127.0.0.1';

const app = new Koa();
app.keys = ['XIAODA-ASSTBOT'];

///////////////////////////////////////////////////////////
app.use(session(app));
app.use(responseTime());
app.use(serve('./static'));
app.use(views(__dirname + '/views', { map: {html: 'nunjucks' }}));
app.use(koaBody());
app.use(controllerRouter(__dirname + '/controllers'));

///////////////////////////////////////////////////////////
app.listen(port, host);
logger.info(`Server is running on ${host}:${port}...`);