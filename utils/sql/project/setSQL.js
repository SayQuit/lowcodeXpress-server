const createDB = require('../../db')

async function updateJSON(account, element, id, name, description, type, tech, lib, dragGroup) {
    const time = new Date().getTime()
    const updateSQL = `UPDATE project SET element = '${JSON.stringify(element)}', lastModified = '${time}', name = '${name}', description = '${description}', type = '${type}', tech = '${tech}', lib='${JSON.stringify(lib)}' WHERE id = '${id}' and account='${account}' and dragGroup = '${dragGroup}';`
    const db = await createDB()
    return new Promise((resolve) => {
        db.query(updateSQL, (error, result) => {
            if (error) reject(error)
            else resolve(result)
        })
    })
}

module.exports = { updateJSON }