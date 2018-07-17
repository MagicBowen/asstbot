const User = require('../models/user');
const Survey = require('../models/survey');
const Statistic = require('../models/statistic');
const logger = require('../utils/logger').logger('gateway');

const apiHandle = async (req) => {
    const userId = req.userId;
    const api = req.api;
    const params = req.arguments;
    let result = null;
    switch(api) {
        case 'get-user-info' :
            result = await User.getInfo(userId);
            break;
        case 'update-asst-nickname':
            result = await User.updateAsstBotNickName(userId, params.nickName);
            break;
        case 'update-asst-gender':
            result = await User.updateAsstBotGender(userId, params.gender);
            break;
        case 'update-asst-header-url':
            result = await User.updateAsstBotAvatarUrl(userId, params.avatarUrl);
            break;
        case 'updateA-asst-master-title':
            result = await User.updateAsstBotMasterTitle(userId, params.masterTitle);
            break;
        case 'get-survey-by-id':
            result = await Survey.getSurveyById(params.id);
            break;
        case 'add-survey':
            result = await Survey.addSurvey(userId, params.survey);
            break;
        case 'update-survey':
            result = await Survey.updateSurvey(userId, params.survey);
            break;
        case 'get-survey-result':
            result = await Survey.getSurveyResultsByUser(userId);
            break;
        case 'add-survey-result':
            result = await Survey.addSurveyResult(userId, params.surveyResult);
            break;
        case 'update-survey-result':
            result = await Survey.updateSurveyResult(userId, params.surveyResult);
            break;                    
        case 'delete-survey-result':
            result = await Survey.deleteSurveyResult(params.id);
            break;
        case 'get-survey-statistic':
            result = await Statistic.getSurveyStatistic(params.id);
            break;
        case 'get-user-statistic':
            result = await Survey.getStatisticByUser(userId);
            break;
        default:
            result = 'unknown gateway api : ' + api;
            logger.error(result);
    }
    return {
        status : {code : 200, errorType : 'success'},
        result : result
    };
};

const gatewayApi = async (ctx) => {
    try {
        const req = ctx.request.body;
        logger.debug(`receive gateway request : ${JSON.stringify(req)}`);
        const rsp = await apiHandle(req);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = rsp;
    } catch(err) {
        ctx.response.status = 404;
        logger.error('gateway api error: ' + err);
        logger.debug(err.stack);
    }
};

module.exports = {
    'POST /gateway' : gatewayApi
}