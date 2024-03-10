const createDB = require('../../db')
const { formatTime } = require('../../time')

async function selectJSON(account, id) {
    const selectSQL = `select * from file where account = '${account}' and id = '${id}'`
    const db = await createDB()
    return new Promise((resolve, reject) => {
        db.query(selectSQL, (error, results) => {
            if (error || results.length !== 1) reject(error)
            else {
                resolve({
                    ...results[0],
                    createAt: formatTime(results[0].createAt),
                })
            }
        })
    })
}

module.exports = { selectJSON }