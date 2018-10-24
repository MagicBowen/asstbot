const User = require('../models/user');
const Survey = require('../models/survey');
const Statistic = require('../models/statistic');
const simplify = require('../utils/simplifier')
const SimplifyResult = require('../models/simplifier')
var arangoDb = require("../models/arango.js")
const logger = require('../utils/logger').logger('gateway');

function convert_to_openId(userId){
    var openId = (userId.length == 28) ? userId : userId.replace("_D_", "-")
    return openId
}

const apiHandle = async (req) => {
    const userId = convert_to_openId(req.userId);
    const api = req.api;
    const params = req.arguments;
    let result = null;
    switch(api) {
        case 'get-user-info' :
            result = await User.getInfo(userId);
            break;
        case 'get-originator-info':
            result = await User.getInfo(params.userId);
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
        case 'update-asst-master-title':
            result = await User.updateAsstBotMasterTitle(userId, params.masterTitle);
            break;
        case 'update-asst-tts':
            result = await User.updateAsstBotTts(userId, params.ttsEnable);
            break;
        case 'get-survey-by-id':
            result = await Survey.getSurveyById(params.id);
            break;
        case 'get-survey-by-user':
            result = await Survey.getSurveyByUser(userId, params ? params.type : null);
            break;
        case 'add-survey':
            result = await Survey.addSurvey(userId, params.survey);
            break;
        case 'update-survey':
            result = await Survey.updateSurvey(userId, params.survey);
            break;
        case 'publish-survey':
            result = await Survey.publishSurvey(userId, params.surveyId)
            break;
        case 'un-publish-survey':
            result = await Survey.unPublishSurvey(userId, params.surveyId)
            break; 
        case 'get-survey-of-community':
            result = await Survey.getSurveyOfCommunity(userId)
            break; 
        case 'delete-survey':
            result = await Survey.deleteSurvey(params.id);
            break;
        case 'get-survey-results-by-user':
            result = await Survey.getSurveyResultsByUser(userId, params ? params.type : null);
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
        case 'get-simplifier-result':
            result = await simplify(params.query);
            break;
        case 'record-simplifier-result':
            result = await SimplifyResult.addResult(userId, params.query, params.result, params.mark, params.modified);
            break;
        case 'query-day-course-for-user':
            result = await arangoDb.getDayCourseForUser(userId, params.weekday)
            break;

        case 'query-all-course-for-user':
            result = await arangoDb.queryAllCourseForUser(userId)
            break;

        case 'save-feedback-for-user':
            var userInfo = await User.getInfo(userId)
            result = await arangoDb.saveFeedbackForUser(userId, userInfo, params.content, params.contactWay)
            break;
            
        case 'get_dictate_words_for_user':
            result = await arangoDb.getActiveDictationWords(userId)
            break;
        
        case 'get-today-horoscope':
            result = await arangoDb.getTodayHoroscope(params.sign)
            break;
    
        case 'get-tomorrow-horoscope':
            result = await arangoDb.getTomorrowHoroscope(params.sign)
            break;
        
        case 'get-week-horoscope':
            result = await arangoDb.getWeekHoroscope(params.sign)
            break;

        case 'get-month-horoscope':
            result = await arangoDb.getMonthHoroscope(params.sign)
            break;
        
        case 'get-horoscope':
            result = await arangoDb.getHoroscope(params.day, params.sign)
            break;

        case 'get-laohuangli':
            result = await arangoDb.getLaohuangli(params.day)
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