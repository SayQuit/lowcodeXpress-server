const createDB = require('../../db')

async function selectUser(token) {
    const selectSQL = `select username, account from user where token='${token}'`
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