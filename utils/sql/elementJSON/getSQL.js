const createDB = require('../../../module/db')

async function selectJSON(account) {
    const selectSQL = `select id,json,createAt from element_json where account = '${account}' order by createAt DESC;`
    const db = await createDB()
    return new Promise((resolve) => {
        db.query(selectSQL, (error, results) => {
            if (error) resolve(null)
            else resolve(results.map((value) => { return { ...value } }))
        })
    })
}

module.exports = { selectJSON }