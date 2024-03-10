const createDB = require('../../db')
const { getRandomID } = require('../../randomID')

async function insertFile(path, name, account) {
    const id=getRandomID()
    const insertSQL = `insert into file(id, path, name, account, createAt) values ('${id}','${path}','${name}','${account}','${new Date().getTime()}')`
    const db = await createDB()
    return new Promise((resolve, reject) => {
        db.query(insertSQL, (error, result) => {
            if (error) reject(error)
            else resolve({
                fileID:id
            })
        })
    })
}

module.exports = { insertFile }