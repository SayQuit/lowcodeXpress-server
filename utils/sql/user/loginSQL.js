const createDB = require('../../../module/db')
const JWT = require('../../jwt')

async function selectUser(account) {
    const selectSQL = `select password, username, account from user where account='${account}'`
    const db = await createDB()
    return new Promise((resolve, reject) => {
        db.query(selectSQL, (error, results) => {
            if (error) reject(error)
            else if (results.length === 0) reject(results)
            else {
                const { password, username, account } = results[0]
                resolve({
                    password,
                    username,
                    account
                })
            }
        })
    })
}

async function updateToken(account) {
    const token = JWT.createToken()
    const updateSQL = `UPDATE user SET token='${token}' WHERE account='${account}';`;
    const db = await createDB()
    return new Promise((resolve, reject) => {
        db.query(updateSQL, (error) => {
            if (error) reject(error)
            else resolve(token)
        })
    })
}


module.exports = { selectUser, updateToken }