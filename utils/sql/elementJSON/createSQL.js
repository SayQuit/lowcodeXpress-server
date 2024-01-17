const createDB = require('../../../module/db')

async function insertJSON(account, json, id, name, description) {
    const time = new Date().getTime()
    const insertSQL = `insert into element_json(account,json,id,createAt,lastModified,name,description) values ('${account}','${json}','${id}','${time}','${time}','${name}','${description}')`
    const db = await createDB()
    return new Promise((resolve) => {
        db.query(insertSQL, (error) => {
            if (error) resolve(null)
            else resolve(true)
        })
    })
}

module.exports = { insertJSON }