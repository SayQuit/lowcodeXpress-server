const createDB = require('../../../module/db')

async function selectJSON(account) {
    const selectSQL = `select id,json,createAt from project where account = '${account}' order by createAt DESC;`
    const db = await createDB()
    return new Promise((resolve, reject) => {
        db.query(selectSQL, (error, results) => {
            if (error) reject(error)
            else resolve(results.map((value) => { return { ...value } }))
        })
    })
}

module.exports = { selectJSON }