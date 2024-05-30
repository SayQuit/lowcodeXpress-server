const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key_here'; // 这里使用签名时使用的密钥
function createToken(account) {
    return jwt.sign({ account }, secretKey, {
        expiresIn: '1y'
    })
}

function checkExpires(token) {
    return new Promise((resolve) => {
        jwt.verify(token, secretKey, (_, result) => {
            resolve(result)
        })
    })
}

async function validateToken(headers) {
    if (!headers) return false
    const authHeader = headers['authorization'];
    if (!authHeader) return false
    const splitHeaders = authHeader.split(' ')
    if (splitHeaders.length !== 2) return false
    const prev = authHeader.split(' ')[0];
    if (prev !== 'Bearer') return false
    const token = authHeader.split(' ')[1];
    const res= await checkExpires(token)
    if (!res) return false
    return res.account
}

async function getDecodeAccount(headers) {
    return await validateToken(headers);
}

module.exports = { createToken, getDecodeAccount };