const createDB = require('../../../module/db')

async function insertUser(account, password, username) {
    const insertSQL = `insert into user(account,username,password) values ('${account}','${username}','${password}')`
    const db = await createDB()
    return new Promise((resolve, reject) => {
        db.query(insertSQL, (error, result) => {
            if (error) reject(error)
            else resolve(result)
        })
    })
}

async function selectAccount() {
    const selectSQL = `select account from user`
    const db = await createDB()
    return new Promise((resolve,reject) => {
        db.query(selectSQL, (error, result) => {
            if (error) reject(error)
            else resolve(result.map((value) => { return { ...value } }))
        })
    })
}


module.exports = { insertUser, selectAccount }