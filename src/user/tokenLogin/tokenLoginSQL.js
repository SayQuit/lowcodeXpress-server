const createDB = require('../../../module/db')

async function selectUser(token) {
    const selectSQL = `select username, account from user where token='${token}'`
    const db = await createDB()
    return new Promise((resolve) => {
        db.query(selectSQL, (error, results) => {
            if (error || results.length === 0) resolve(null)
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