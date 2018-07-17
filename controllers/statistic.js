const Statistic = require('../models/statistic');
const Survey = require('../models/survey');
const logger = require('../utils/logger').logger('survey-statistic');

const getSurveyStatistic = async (ctx) => {
    try {
        let surveyStatistic = await Statistic.getSurveyStatistic(ctx.query.surveyId);
        if (surveyStatistic) {
            ctx.response.type = "application/json";
            ctx.response.status = 200;
            ctx.response.body = {result : surveyStatistic};
        } else {
            let survey = await Survey.getSurveyById(ctx.query.surveyId);
            if (survey) {
                await Statistic.addSurveyStatistic(survey);
                ctx.response.type = "application/json";
                ctx.response.status = 200;
                ctx.response.body = {result : Statistic.getEmptyStatisticBy(survey)};
                logger.warn(`add miss survey statistic for survey ${ctx.query.surveyId}!`);
            } else {
                ctx.response.status = 404;
                logger.warn(`survey statistic is not exist!`);
            }
        }
    } catch(err) {
        ctx.response.status = 404;
        logger.error('get survey statistic error: ' + err.stack);
    }
};

const reviewSurveyStatistic = async (ctx) => {
    try {
        await Statistic.clearLastReviewCount(ctx.request.body.surveyId);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success'};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed', cause : err.toString()};
        logger.error(`post survey statistic review error: ` + err.stack);
    }
};

const getStatisticByUser = async (ctx) => {
    try {
        const statistic = await Survey.getStatisticByUser(ctx.query.userId);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : statistic};
    } catch(err) {
        ctx.response.status = 404;
        logger.error(`get user statistic failed: ` + err.stack);
    }    
}

module.exports = {
    'GET /survey/statistic'  : getSurveyStatistic,
    'POST /survey/statistic/review' : reviewSurveyStatistic,
    'GET /user/statistic' : getStatisticByUser
};
