const createDB = require('../../db')

async function updateJSON(account, element, id, name, description, type, tech, lib, variable, event) {
    const time = new Date().getTime()
    const updateSQL = `UPDATE project SET element = '${JSON.stringify(element)}', lastModified = '${time}', name = '${name}', description = '${description}', type = '${type}', tech = '${tech}', lib='${JSON.stringify(lib)}',variable='${JSON.stringify(variable)}',event='${JSON.stringify(event)}' WHERE id = '${id}' and account='${account}';`
    const db = await createDB()
    return new Promise((resolve,reject) => {
        db.query(updateSQL, (error, result) => {
            if (error) reject(error)
            else resolve(result)
        })
    })
}

module.exports = { updateJSON }