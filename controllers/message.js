const textMsg = {
    from : {
        id : 'xxxxx'
    },
    type : 'text',
    data : {
        query : 'hello'
    }
};

const imageMsg = {
    from : {
        id : 'xxxxx'
    },
    type : 'image',
    data : {
        url : 'http://localhost:8000/test.jpg'
    }
};

const loginMsg = {
    from : {
        id : 'xxxxx'
    },
    type : 'login',
    data : {
        code : '12345'
    }
}

const logger = require('../utils/logger').logger('message');

const talkToChatBot = async(userId, type, data) => {
    switch(type) {
        case 'login':
            return {
                to : {
                    id : userId
                },
                type : 'text',
                data : {
                    replies : ['你好，主人', '感谢领养我哦']
                }
            };
        
        case 'text':
            return {
                to : {
                    id : userId
                },
                type : 'radio',
                data : {
                    items : [
                        {caption : '男', value : '我是男的'},
                        {caption : '女', value : '我是女的'},
                    ]
                }
            };
        case 'image':
            return {
                to : {
                    id : userId
                },
                type : 'image',
                data : {
                    url : 'http://localhost:8000/test.jpg',
                    width : 150,
                    height: 100
                }
            };
        default:
            logger.error(`receive unknown msg type(${type}) from client`);
    }
}

const handleMessage = async (ctx) => {
    const msg = ctx.query;
    const userId = msg.from.id;
    const type = msg.type;

    if (!msg || !userId || !type) {
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
    'POST /message' : handleMessage
};