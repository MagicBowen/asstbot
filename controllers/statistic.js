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

module.exports = {
    'GET /survey/statistic'  : getSurveyStatistic
};
