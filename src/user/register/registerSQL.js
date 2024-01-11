const createDB = require('../../../module/db')

async function insertUser(account, password, username) {
    const insertSQL = `insert into user(account,username,password) values ('${account}','${username}','${password}')`
    const db = await createDB()
    return new Promise((resolve) => {
        db.query(insertSQL, (error) => {
            if (error) resolve(null)
            else resolve(true)
        })
    })
}

async function selectAccount() {
    const selectSQL = `select account from user`
    const db = await createDB()
    return new Promise((resolve) => {
        db.query(selectSQL, (error, result) => {
            if (error) resolve(null)
            else resolve(result.map((value) => { return { ...value } }))
        })
    })
}


module.exports = { insertUser, selectAccount }