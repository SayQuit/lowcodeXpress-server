const createDB = require('../../../module/db')

async function insertJSON(account, json, id, name, description) {
    const time = new Date().getTime()
    const insertSQL = `insert into project(account,json,id,createAt,lastModified,name,description) values ('${account}','${json}','${id}','${time}','${time}','${name}','${description}')`
    const db = await createDB()
    return new Promise((resolve, reject) => {
        db.query(insertSQL, (error, result) => {
            if (error) reject(error)
            else resolve(result)
        })
    })
}

module.exports = { insertJSON }