const createDB = require('../../db')
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
    return JWT.createToken(account)
}
module.exports = { selectUser, updateToken }