const createDB = require('../../db')

async function selectJSON(account) {
    const selectSQL = `select createAt, id, name, desc, type, tech, lib from project where account = '${account}' order by createAt DESC;`
    const db = await createDB()
    return new Promise((resolve, reject) => {
        db.query(selectSQL, (error, results) => {
            if (error) reject(error)
            else resolve(results.map((item) => {
                return { ...item, lib: JSON.parse(item.lib) }
            }))
        })
    })
}

module.exports = { selectJSON }