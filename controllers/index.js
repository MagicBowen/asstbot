var index = async (ctx, next) => {
    await ctx.render('index.html');
};

module.exports = {
    'GET /': index
};