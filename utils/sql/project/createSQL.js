const createDB = require('../../db')

async function insertJSON(account, element, id, name, description, type, tech, lib, variable, event, props) {
    const time = new Date().getTime()
    const insertSQL = `insert into project(account, element, id, createAt, lastModified, name, description, type, tech, lib, variable, event, props) values ('${account}','${JSON.stringify(element)}','${id}','${time}','${time}','${name}','${description}','${type}','${tech}','${JSON.stringify(lib)}','${JSON.stringify(variable)}','${JSON.stringify(event)}','${JSON.stringify(props)}')`
    const db = await createDB()
    return new Promise((resolve, reject) => {
        db.query(insertSQL, (error, result) => {
            if (error) reject(error)
            else resolve(result)
        })
    })
}

module.exports = { insertJSON }