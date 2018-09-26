const postJson = require('../utils/postjson');
const config = require('../config');
const User = require('../models/user');
const logger = require('../utils/logger').logger('chatbot');

class Chatbot {
    constructor(agent, uri) {
        this.agent = agent;
        this.uri = uri;
    }
    
    async replyToText(user, text) {
        const data = { query   : { query : text, confidence : 1.0 }, 
                     session : user.id,
                     agent   : this.agent, 
                     userContext : user };

        logger.debug('send to chatbot : ' + JSON.stringify(data));

        const response = await postJson(this.uri, data);
        return this.formatResponse(user, response);
    }
    
    async replyToEvent(user, eventType, params) {
        const data = { event   : { name : eventType, content : { data : params } },
                     session : user.id,
                     agent   : this.agent,
                     userContext : user };

        const response = await postJson(this.uri, data);
        return this.formatResponse(user, response);
    }

    formatResponse(user, response) {
        let result = {
            to : { id : user.id },
            msgs: []
        };
        if (response.hasOwnProperty('reply')) {
            for (let i = 0; i < response.reply.length; i++){
                result.msgs.push({type : 'text', reply : response.reply[i]});
            }
        } 
        if (response.hasOwnProperty('data')) {
            result.msgs.push(...response['data']);
        }
        return result;
    }
}

const getUserInfo = async (userId) => {
    try {
        const user = await User.getInfo(userId);
        const userContext = { id : userId };
        if(user == null ) {
            return userContext
        }
        if (user.wechat && user.wechat.nickName) {
            userContext.nickName = user.wechat.nickName;
        }
        if (user.wechat && user.wechat.avatarUrl) {
            userContext.avatarUrl = user.wechat.avatarUrl;
        }

        return userContext;
    } catch (err) {
        logger.error(`get user info of ${userId} error: ` + err);
        throw err;
    }
}

const fakeResponse = (userId, type, params) => {
    let result = {
        to : { id : userId },
        msgs: []
    };

    if (params.query === '测试html') {
        result.msgs.push({
            type : 'html', 
            reply : '<h4>语文</h4><li>时间：9：00 ~ 10：00</li><li>地点：文津楼</li><li>老师：王文</li>'
        })
    } else if (params.query === '测试html分页') {
        result.msgs.push({
            type   : 'page-list',
            pages  : [
                {
                    type   : 'html',
                    body  : '<h4>语文</h4><li>时间：9：00 ~ 10：00</li><li>地点：文津楼</li><li>老师：王文</li>'
                },
                {
                    type   : 'html',
                    body  : '<h4>数学</h4><li>时间：10：00 ~ 11：00</li><li>地点：科苑楼</li><li>老师：张锋</li>'
                }	
            ]
        })
    } else {
        return null
    }
    return result
}

const talkToChatBot = async (agent, userId, type, params) => {
    const result = fakeResponse(userId, type, params)
    if (result) return result

    const user = await getUserInfo(userId);
    const chatbot = new Chatbot(agent, config.chatbot_url);
    if (type === 'text') {
        return await chatbot.replyToText(user, params.query);
    } else if (type === 'speech') {
        return await chatbot.replyToText(user, params.asr);
    } else if (type === 'event') {
        if ((params)&&(params.hasOwnProperty('name'))) {
            return await chatbot.replyToEvent(user, params.name, params);
        }
    } else if ((params)&&(params.hasOwnProperty('event'))) {
        return await chatbot.replyToEvent(user, params.event, params);
    }
    return await chatbot.replyToEvent(user, type, params);
}

const handleMessage = async (ctx, agent) => {
    const msg = ctx.request.body;

    logger.debug(`receive chat msg from client to agent ${agent}: ${JSON.stringify(msg)}`);

    const userId = msg.from.id;
    const type = msg.type;

    if (!userId || !type) {
        ctx.response.status = 404;
        logger.error('message header format error');
        return;
    }

    try {
        const response = await talkToChatBot(agent, userId, type, msg.data);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = response;
    } catch (err) {
        ctx.response.status = 404;
        logger.error('talk to chatbot error: ' + err);
        logger.error(err.stack);
    }
}

const handleSurveyMessage = async (ctx) => {
    await handleMessage(ctx, config.surveyAgent);
}

const handleAssistantMessage = async(ctx) => {
    await handleMessage(ctx, config.agent);
}

module.exports = {
    'POST /chatbot' : handleAssistantMessage,
    'POST /chatbot/survey' : handleSurveyMessage,
};