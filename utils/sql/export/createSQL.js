const createDB = require('../../db')
const { getRandomID } = require('../../randomID')

async function insertJSON(path, name, account) {
    const insertSQL = `insert into file(id, path, name, account, createAt) values ('${getRandomID()}','${path}','${name}','${account}','${new Date().getTime()}')`
    const db = await createDB()
    return new Promise((resolve, reject) => {
        db.query(insertSQL, (error, result) => {
            if (error) reject(error)
            else resolve(result)
        })
    })
}

module.exports = { insertJSON }