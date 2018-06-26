const postJson = require('../utils/postjson');
const logger = require('../utils/logger').logger('chatbot');

class Chatbot {
    constructor(agent, uri) {
        this.agent = agent;
        this.uri = uri;
    }
    
    async replyToText(user, text) {
        let data = { query   : { query : text, confidence : 1.0 }, 
                     session : user.user_id, 
                     agent   : this.agent, 
                     userContext : { access_token : user.access_token } };

        let response = await postJson(this.uri, data);
        return this.formatResponse(response);
    }

    async replyToRecord(user, asr, fileId) {
        let data = { query   : { query : asr, confidence : 1.0 }, 
                     session : user.user_id, 
                     agent   : this.agent, 
                     userContext : { access_token : user.access_token, file_id : fileId } };

        let response = await postJson(this.uri, data);
        return this.formatResponse(response);        
    }
    
    async replyToEvent(user, eventType, params) {
        let data = { event   : { name : eventType, content : params },
                     session : user.user_id, 
                     agent   : this.agent, 
                     userContext : { access_token : user.access_token } };

        let response = await postJson(this.uri, data);
        return this.formatResponse(response);
    }

    formatResponse(response) {
        logger.debug(`chatbot reply ${JSON.stringify(response)}`);
        if (response.reply) {
            response.reply = this.concatReplies(response.reply);
        }
        return response;
    }

    concatReplies(replies) {
        let result = '';
        for(let i = 0; i < replies.length; i++) {
            result += replies[i];
        }
        return result;
    }
}

module.exports = Chatbot;