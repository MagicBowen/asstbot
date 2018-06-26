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
        const data = { event   : { name : eventType, content : params },
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
        if (user.wechat.nickName) {
            userContext.wechatName = user.wechat.nickName;
        }
        if (user.asstBot.nickName) {
            userContext.asstBotName = user.asstBot.nickName;
        }
        if (user.asstBot.masterTitle) {
            userContext.masterName = user.asstBot.masterTitle;
        }
        return userContext;
    } catch (err) {
        logger.error(`get user info of ${userId} error: ` + err);
    }
}

const talkToChatBot = async (userId, type, params) => {
    const user = await getUserInfo(userId);
    const chatbot = new Chatbot(config.agent, config.chatbot_url);
    if (type === 'text') {
        return await chatbot.replyToText(user, params.query);
    }
    return await chatbot.replyToEvent(user, type, params);
}

const handleMessage = async (ctx) => {
    const msg = ctx.request.body;

    logger.debug(`receive chat msg from client: ${JSON.stringify(msg)}`);

    const userId = msg.from.id;
    const type = msg.type;

    if (!userId || !type) {
        ctx.response.status = 404;
        logger.error('message header format error');
        return;
    }

    try {
        const response = await talkToChatBot(userId, type, msg.data);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = response;
    } catch (err) {
        ctx.response.status = 404;
        logger.error('talk to chatbot error: ' + err);
    }
}

module.exports = {
    'POST /chatbot' : handleMessage
};