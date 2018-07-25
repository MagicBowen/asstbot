const Survey = require('../models/survey');
const logger = require('../utils/logger').logger('survey');

const getSurvey = async (ctx) => {
    try {
        let survey = null;
        if (ctx.query.id) {
            survey = await Survey.getSurveyById(ctx.query.id);
        } else if (ctx.query.userId) {
            survey = await Survey.getSurveyByUser(ctx.query.userId, ctx.query.type);
        }
        if (survey) {
            ctx.response.type = "application/json";
            ctx.response.status = 200;
            ctx.response.body = {result : survey};
        } else {
            ctx.response.status = 404;
            logger.warn(`survey is not exist!`);
        }
    } catch(err) {
        ctx.response.status = 404;
        logger.error('get survey error: ' + err.stack);
    }
};

const addSurvey = async (ctx) => {
    try {
        const id = await Survey.addSurvey(ctx.request.body.survey.userId, ctx.request.body.survey);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success', id : id};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed', cause : err.toString()};
        logger.error(`add survey error: ` + err.stack);
    }
};

const updateSurvey = async (ctx) => {
    try {
        const id = await Survey.updateSurvey(ctx.request.body.survey.userId, ctx.request.body.survey);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success', id : id};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed', cause : err.toString()};
        logger.error(`update survey error: ` + err.stack);
    }    
};

const deleteSurvey = async (ctx) => {
    try {
        await Survey.deleteSurvey(ctx.query.id);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success'};
    } catch(err) {
        ctx.response.status = 404;
        logger.error(`delete survey error: ` + err.stack);
    }    
};

module.exports = {
    'GET /survey'  : getSurvey,
    'POST /survey' : addSurvey,
    'PUT /survey'  : updateSurvey,
    'DELETE /survey'  : deleteSurvey
};
