const jwt = require('jsonwebtoken');
const secret = "secret";
function createToken(account) {
    return jwt.sign({ account }, secret, {
        expiresIn: '24h'
    })
}
function checkExpires(token) {
    let res
    jwt.verify(token, secret, (error, result) => {
        res = result
    })
    return res
}

module.exports = { createToken, checkExpires };