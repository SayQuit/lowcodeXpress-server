const createDB = require('../../../module/db')
const JWT = require('../../jwt')

async function selectUser(account) {
    const selectSQL = `select password, username, account from user where account='${account}'`
    const db = await createDB()
    return new Promise((resolve) => {
        db.query(selectSQL, (error, results) => {
            if (error || results.length === 0) resolve(null)
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
    return new Promise((resolve) => {
        db.query(updateSQL, (error) => {
            if (error) resolve(null)
            resolve(token)
        })
    })
}


module.exports = { selectUser, updateToken }