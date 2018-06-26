const postJson = require('../utils/postjson');
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

        const response = await postJson(this.uri, data);
        return this.formatResponse(response);
    }
    
    async replyToEvent(user, eventType, params) {
        const data = { event   : { name : eventType, content : params },
                     session : user.id, 
                     agent   : this.agent, 
                     userContext : user };

        const response = await postJson(this.uri, data);
        return this.formatResponse(response);
    }

    formatResponse(user, response) {
        let result = {
            to : {
                id : user.id
            },
            type : 'unknown',
            data : {
            }
        };
        if (response.hasOwnProperty('reply')) {
            result.type = 'text'
            result.data.replies = response.reply;
        } else if (response.hasOwnProperty('reply-data')) {
            result.type = response['reply-data'].type;
            for (let k in response) {
                if (k != 'type') {
                    result.data[k] = response['reply-data'][k];
                }
            }       
        } else {
            logger.error('reply from chatbot has no valid reply: ' + response);
        }
        return result;
    }
}

module.exports = Chatbot;