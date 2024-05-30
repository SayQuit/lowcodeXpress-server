const createDB = require('../../db')

async function selectUser(account) {
    const selectSQL = `select username, account from user where account='${account}'`
    const db = await createDB()
    return new Promise((resolve,reject) => {
        db.query(selectSQL, (error, results) => {
            if (error) reject(error)
            else if (results.length === 0) reject(results)
            else {
                const { username, account } = results[0]
                resolve({
                    username,
                    account
                })
            }
        })
    })
}


module.exports = { selectUser }