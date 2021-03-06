
var pinyin = require("pinyin");


const getPinyin = async(ctx) => {
    const sentence = ctx.request.query.sentence;
    var ret = {}
    ret.wordPinyin = pinyin(sentence, {heteronym: true})
    ret.termPinyin = pinyin(sentence, {heteronym: true, segment: true})
    // ret.wordPinyin2 = pinyin(sentence, {heteronym: true, style:pinyin.STYLE_TONE2})
    // ret.termPinyin2 = pinyin(sentence, {heteronym: true, segment: true, style:pinyin.STYLE_TONE2})
    ctx.response.type = "application/json";
    ctx.response.status = 200;
    ctx.response.body = {result : 'success', data : ret};
}


module.exports = {
    'GET /pinyin'  : getPinyin,
};