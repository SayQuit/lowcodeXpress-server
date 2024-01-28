const createDB = require('../../db')

async function selectJSON(account, id) {
    const selectSQL = `select createAt, id, name, desc, type, tech, lib , json from project where account = '${account}' and id = '${id}'`
    const db = await createDB()
    return new Promise((resolve, reject) => {
        db.query(selectSQL, (error, results) => {
            if (error || results.length !== 1) reject(error)
            else {
                resolve({
                    ...results[0],
                    element: JSON.parse(results[0].json)
                })
            }
        })
    })
}

module.exports = { selectJSON }