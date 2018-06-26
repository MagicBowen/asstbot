const logger = require('../utils/logger').logger('message');

const talkToChatBot = async(userId, type, data) => {
    switch(type) {
        case 'login':
            return {
                to : {
                    id : userId
                },
                msgs: [
                    {
                        type : 'text',
                        reply: '你好，主人'
                    },
                    {
                        type : 'text',
                        reply: '感谢领养我哦~'
                    }                    
                ]
            };
        
        case 'text':
            return {
                to : {
                    id : userId
                },
                msgs: [
                    {
                        type : 'radio',
                        title : '您是男的还是女的呢？',
                        items : [
                            {caption : '男', value : '我是男的'},
                            {caption : '女', value : '我是女的'},
                        ]
                    }
                ]
            };
        case 'image':
            return {
                to : {
                    id : userId
                },
                msgs : [
                    {
                        type : 'text',
                        reply: '这是您上传的头像：'
                    },
                    {
                        type : 'image',
                        title : '头像',
                        url : data.url,
                        width : 150,
                        height: 100
                    }
                ]
            };
        default:
            logger.error(`receive unknown msg type(${type}) from client`);
    }
}

const handleMessage = async (ctx) => {
    const msg = ctx.request.body;

    logger.debug(`receive msg from client: ${JSON.stringify(msg)}`);

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