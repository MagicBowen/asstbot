const logger = require('../utils/logger').logger('mongo-user');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function getlocalDateString(){
    var myDate = new Date()
    return myDate.toLocaleDateString()
}

mongoose.model('Users', new Schema({
    id: { type: String, unique: true, required: true},
    wechat: {
        nickName : String,
        gender   : String,
        city     : String,
        province : String,
        country  : String,
        avatarUrl: String,
        language : String
    },
    asstBot: {
        nickName     : String,
        gender       : String,
        avatarUrl    : String,
        masterTitle  : String,
        horoscope    : String, 
        tts          : Boolean,
        lastLoginDay : String
    }
}));

const User = mongoose.model('Users');

const model = {};

model.getInfo = async (userId) => {
    logger.debug(`Looking up user ${userId}`);

    const condition = {id : userId};
    return await User.findOne(condition).exec();
};

model.updateWechatInfo = async (userId, wechatInfo) => {
    const oriUser = await User.findOne({id : userId}).exec();
    
    if (oriUser) {
        let newUser = { id : userId, wechat : wechatInfo };
        if (oriUser.hasOwnProperty('asstBot')) {
            newUser.asstBot = oriUser.oriUser;
        } else {
            newUser.asstBot = {masterTitle : wechatInfo.nickName};
        }
        oriUser.set(newUser);
        await oriUser.save();
        logger.debug(`update user ${userId} wechat info successful!`);
        return;
    }

    const user = new User({
        id : userId,
        wechat  : wechatInfo,
        asstBot : {masterTitle : wechatInfo.nickName}
    });
    await user.save();
    logger.debug(`Add new user ${userId}:${wechatInfo.nickName} successful!`);
}

model.updateAsstBotNickName = async (userId,  nickName) => {
    const oriUser = await User.findOne({id : userId}).exec();
    
    if (oriUser) {
        let newUser = oriUser.toObject();
        if(!newUser.asstBot){
            newUser.asstBot = {}
        }
        newUser.asstBot.nickName = nickName;
        oriUser.set(newUser);
        await oriUser.save();
        logger.debug(`update nickname ${nickName} of user ${userId} successful!`);
        return;
    }

    const user = new User({
        id : userId,
        asstBot : {nickName : nickName},
    });
    await user.save();
    logger.debug(`Add new user ${userId} by asstbot nickname ${nickName} successful!`);
}

model.updateAsstBotGender = async (userId,  gender) => {
    const oriUser = await User.findOne({id : userId}).exec();
    
    if (oriUser) {
        let newUser = oriUser.toObject();
        if(!newUser.asstBot){
            newUser.asstBot = {}
        }
        newUser.asstBot.gender = gender;
        oriUser.set(newUser);
        await oriUser.save();
        logger.debug(`update gender ${gender} of user ${userId} successful!`);
        return;
    }

    const user = new User({
        id : userId,
        asstBot : {gender : gender},
    });
    await user.save();
    logger.debug(`Add new user ${userId} by asstbot gender ${gender} successful!`);
}

model.updateAsstBotAvatarUrl = async (userId,  avatarUrl) => {
    const oriUser = await User.findOne({id : userId}).exec();
    
    if (oriUser) {
        let newUser = oriUser.toObject();
        if(!newUser.asstBot){
            newUser.asstBot = {}
        }
        newUser.asstBot.avatarUrl = avatarUrl;
        oriUser.set(newUser);
        await oriUser.save();
        logger.debug(`update avatarUrl ${avatarUrl} of user ${userId} successful!`);
        return;
    }

    const user = new User({
        id : userId,
        asstBot : {avatarUrl : avatarUrl},
    });
    await user.save();
    logger.debug(`Add new user ${userId} by asstbot avatarUrl ${avatarUrl} successful!`);
}

model.updateAsstBotMasterTitle = async (userId,  masterTitle) => {
    const oriUser = await User.findOne({id : userId}).exec();
    
    if (oriUser) {
        let newUser = oriUser.toObject();
        if(!newUser.asstBot){
            newUser.asstBot = {}
        }
        newUser.asstBot.masterTitle = masterTitle;
        oriUser.set(newUser);
        await oriUser.save();
        logger.debug(`update masterTitle ${masterTitle} of user ${userId} successful!`);
        return;
    }

    const user = new User({
        id : userId,
        asstBot : {masterTitle : masterTitle},
    });
    await user.save();
    logger.debug(`Add new user ${userId} by asstbot masterTitle ${masterTitle} successful!`);
}

model.updateAsstBotTts = async (userId,  tts) => {
    const oriUser = await User.findOne({id : userId}).exec();
    
    if (oriUser) {
        let newUser = oriUser.toObject();
        if(!newUser.asstBot){
            newUser.asstBot = {}
        }
        newUser.asstBot.tts = tts;
        oriUser.set(newUser);
        await oriUser.save();
        logger.debug(`update tts ${tts} of user ${userId} successful!`);
        return;
    }

    const user = new User({
        id : userId,
        asstBot : {tts : tts},
    });
    await user.save();
    logger.debug(`Add new user ${userId} by asstbot tts ${tts} successful!`);
}

model.updateHoroscope = async (userId,  horoscope) => {
    const oriUser = await User.findOne({id : userId}).exec();
    
    if (oriUser) {
        let newUser = oriUser.toObject();
        if(!newUser.asstBot){
            newUser.asstBot = {}
        }
        newUser.asstBot.horoscope = horoscope;
        oriUser.set(newUser);
        await oriUser.save();
        logger.debug(`update horoscope ${horoscope} of user ${userId} successful!`);
        return;
    }

    const user = new User({
        id : userId,
        asstBot : {horoscope : horoscope},
    });
    await user.save();
    logger.debug(`Add new user ${userId} by asstbot horoscope ${horoscope} successful!`);
}

model.getHoroscope = async (userId) => {
    const oriUser = await User.findOne({id : userId}).exec();
    if(!oriUser){
        return null
    }
    const user = oriUser.toObject();
    if(!user.asstBot){
         return null
    }
    return user.asstBot.horoscope
}

model.updateLastLoginDay = async (userId) => {
    var localDateString = getlocalDateString();
    const oriUser = await User.findOne({id : userId}).exec();
    if (oriUser) {
        let newUser = oriUser.toObject();
        if (!newUser.asstBot) {
            newUser.asstBot = {}
        }
        if (newUser.asstBot.lastLoginDay != localDateString) {
            newUser.asstBot.lastLoginDay = localDateString
            oriUser.set(newUser);
            await oriUser.save();
        }
        logger.debug(`update lastLoginDay ${localDateString} of user ${userId} successful!`);
        return;
    }
    const user = new User({
        id : userId,
        asstBot : {lastLoginDay : localDateString},
    });
    await user.save();
    logger.debug(`Add new user ${userId} by asstbot lastLoginDay ${localDateString} successful!`);
    return
}


model.getLastLoginDay = async (userId) => {
    const oriUser = await User.findOne({id : userId}).exec();
    if(!oriUser){
        return null
    }
    const user = oriUser.toObject();
    if(!user.asstBot){
         return null
    }
    return user.asstBot.lastLoginDay
}

module.exports = model;