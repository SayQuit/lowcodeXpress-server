const createDB = require('../../../module/db')

async function updateJSON(id, json, account, name, description) {
    const time = new Date().getTime()
    const updateSQL = `UPDATE element_json SET json = '${json}', lastModified = '${time}', name = '${name}', description = '${description}' WHERE id = '${id}' and account='${account}';`
    const db = await createDB()
    return new Promise((resolve) => {
        db.query(updateSQL, (error) => {
            if (error) resolve(null)
            else resolve(true)
        })
    })
}

module.exports = { updateJSON }