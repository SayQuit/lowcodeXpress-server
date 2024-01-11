const uuid = require('uuid');

function getRandomID() {
    return uuid.v1()
}

module.exports = { getRandomID }