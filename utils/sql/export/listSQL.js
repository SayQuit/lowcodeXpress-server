const createDB = require('../../db')
const { formatTime } = require('../../time')

async function selectJSON(account) {
    const selectSQL = `select * from file where account = '${account}' order by createAt DESC;`
    const db = await createDB()
    return new Promise((resolve, reject) => {
        db.query(selectSQL, (error, results) => {
            if (error) reject(error)
            else resolve(results.map((item) => {
                return { 
                    ...item, 
                    createAt: formatTime(item.createAt),
                }
            }))
        })
    })
}

module.exports = { selectJSON }