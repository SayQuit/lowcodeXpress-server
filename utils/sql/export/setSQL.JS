const createDB = require('../../db')

async function updateIsCreated(account, id) {
    const updateSQL = `UPDATE file SET isCreated = '1' WHERE id = '${id}' and account='${account}';`
    const db = await createDB()
    return new Promise((resolve, reject) => {
        db.query(updateSQL, (error, result) => {
            if (error) reject(error)
            else resolve(result)
        })
    })
}

module.exports = { updateIsCreated }