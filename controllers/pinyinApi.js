
var pinyin = require("pinyin");


const getPinyin = async(ctx) => {
    const sentence = ctx.request.query.sentence;
    var result  = pinyin(sentence, {heteronym: true})
    ctx.response.type = "application/json";
    ctx.response.status = 200;
    ctx.response.body = {result : 'success', data : result};
}


module.exports = {
    'GET /pinyin'  : getPinyin,
};