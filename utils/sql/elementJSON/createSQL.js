const createDB = require('../../../module/db')

async function insertJSON(account, json, id) {
    const insertSQL = `insert into element_json(account,json,id,createAt) values ('${account}','${json}','${id}','${new Date().getTime()}')`
    const db = await createDB()
    return new Promise((resolve) => {
        db.query(insertSQL, (error) => {
            if (error) resolve(null)
            else resolve(true)
        })
    })
}

module.exports = { insertJSON }