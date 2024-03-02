const createDB = require('../../db')

async function insertJSON(account, element, id, name, description, type, tech, variable, event, props, lib, onload) {
    const time = new Date().getTime()
    const insertSQL = `insert into onlineProject(account, element, id, createAt, name, description, type, tech, variable, event, props, lib, onload) values ('${account}','${JSON.stringify(element)}','${id}','${time}','${name}','${description}','${type}','${tech}','${JSON.stringify(variable)}','${JSON.stringify(event)}','${JSON.stringify(props)}','${JSON.stringify(lib)}','${onload}')`
    const db = await createDB()
    return new Promise((resolve, reject) => {
        db.query(insertSQL, (error, result) => {
            if (error) reject(error)
            else resolve(result)
        })
    })
}

module.exports = { insertJSON }