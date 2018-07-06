const uuid = require('node-uuid');

function getGlobalId() {
    const id  = uuid.v1();
    return id.replace(/-/g, '');
}

module.exports = getGlobalId;