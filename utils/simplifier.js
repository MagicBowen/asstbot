const config = require('../config')
const postJson = require('./postjson')

async function simplify(query) {
    const result = await postJson(config.simplifier, {x : query})
    return result.y
}

module.exports = simplify