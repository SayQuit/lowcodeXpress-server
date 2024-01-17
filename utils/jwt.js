const jwt = require('jsonwebtoken');
const secret = "secret";
function createToken(account) {
    return jwt.sign({ account }, secret, {
        expiresIn: '24h'
    })
}
function checkExpires(token) {
    let res = false
    jwt.verify(token, secret, (error, result) => {
        if (!error && result) res = true
    })
    return res
}

function validateToken(headers) {
    if (!headers) return false
    const authHeader = headers['authorization'];
    if (!authHeader) return false
    const splitHeaders = authHeader.split(' ')
    if (splitHeaders.length !== 2) return false
    const token = authHeader.split(' ')[1];
    if (!checkExpires(token)) return false
    return true

}

function getToken(headers) {
    if(!validateToken(headers))return null
    return headers['authorization'].split(' ')[1];
}

module.exports = { createToken, getToken };