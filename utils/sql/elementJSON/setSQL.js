const createDB = require('../../../module/db')

async function updateJSON(id, json, account) {
    const updateSQL = `UPDATE element_json SET json = '${json}' WHERE id = '${id}' and account='account';`
    const db = await createDB()
    return new Promise((resolve) => {
        db.query(updateSQL, (error, results) => {
            if (error) resolve(null)
            else resolve(true)
        })
    })
}

module.exports = { updateJSON }