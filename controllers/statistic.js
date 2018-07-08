const Statistic = require('../models/statistic');
const logger = require('../utils/logger').logger('survey-statistic');

const getSurveyStatistic = async (ctx) => {
    try {
        let surveyStatistic = await Statistic.getSurveyStatistic(ctx.query.surveyId);
        if (surveyStatistic) {
            ctx.response.type = "application/json";
            ctx.response.status = 200;
            ctx.response.body = {result : surveyStatistic};
        } else {
            ctx.response.status = 404;
            logger.warn(`survey statistic is not exist!`);
        }
    } catch(err) {
        ctx.response.status = 404;
        logger.error('get survey statistic error: ' + err.stack);
    }
};

module.exports = {
    'GET /survey/statistic'  : getSurveyStatistic
};
