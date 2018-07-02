const Survey = require('../models/survey');
const logger = require('../utils/logger').logger('survey-result');

const getSurveyResult = async (ctx) => {
    try {
        let surveyResult = null;
        if (ctx.query.id) {
            surveyResult = await Survey.getSurveyResultById(ctx.query.id);
        } else if (ctx.query.surveyId) {
            surveyResult = await Survey.getSurveyResults(ctx.query.surveyId);
        }
        if (surveyResult) {
            ctx.response.type = "application/json";
            ctx.response.status = 200;
            ctx.response.body = {result : surveyResult};
        } else {
            ctx.response.status = 404;
            logger.warn(`survey result is not exist!`);
        }
    } catch(err) {
        ctx.response.status = 404;
        logger.error('get survey result error: ' + err);
    }
};

const addSurveyResult = async (ctx) => {
    try {
        const id = await Survey.addSurveyResult(ctx.request.body.surveyResult.responder.userId, ctx.request.body.surveyResult);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success', id : id};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed', cause : err};
        logger.error(`add survey result error: ` + err);
    }
};

const updateSurveyResult = async (ctx) => {
    try {
        const id = await Survey.updateSurveyResult(ctx.request.body.surveyResult.responder.userId, ctx.request.body.surveyResult);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success', id : id};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed', cause : err};
        logger.error(`update survey result error: ` + err);
    }    
};

const deleteSurveyResult = async (ctx) => {
    try {
        await Survey.deleteSurveyResult(ctx.query.id);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success'};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed'};
        logger.error(`delete survey result error: ` + err);
    }    
};

module.exports = {
    'GET /survey/result'  : getSurveyResult,
    'POST /survey/result' : addSurveyResult,
    'PUT /survey/result'  : updateSurveyResult,
    'DELETE /survey/result'  : deleteSurveyResult
};
