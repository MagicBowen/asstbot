const axios = require('axios');
const config = require('../config')
const logger = require('./logger').logger('util_access_tocken');

class AccessTocken {
    constructor() {
        this.value = null;
        this.freshTimeStamp = 0;
        this.expiryTimeStamp = 0;
    }

    async getTocken() {
        if (this.isExpired) {
            await this.updateTocken();
        }
        return this.value;
    }

    get isExpired() {
        return (this.expiryTimeStamp - this.freshTimeStamp) < 300;
    }

    async updateTocken() {
        try {
            logger.debug('try update access tocken from wechat');
            const result = await axios.get('https://api.weixin.qq.com/cgi-bin/token',
                {
                    params: {
                        appid: config.appid,
                        secret: config.secret,
                        grant_type: 'client_credential'
                    }
                }
            );
            if (result.data.errcode) {
                throw Error(result.data.errmsg);
            }
            this.freshTimeStamp = Math.floor(Date.now() / 1000);
            this.expiryTimeStamp = this.freshTimeStamp + result.data.expires_in;
            this.value = result.data.access_token;
            logger.info(`get new access tocken ${this.value} in timestamp ${this.freshTimeStamp}`);

        } catch (err) {
            logger.error('update access tocken error : ' + err);
            throw err;
        }
    }
}

const accessTocken = new AccessTocken();

module.exports = accessTocken;

