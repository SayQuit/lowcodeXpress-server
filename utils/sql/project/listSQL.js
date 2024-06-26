const createDB = require('../../db')
const { formatTime } = require('../../time')

async function selectJSON(account) {
    const selectSQL = `select * from project where account = '${account}' order by lastModified DESC;`
    const db = await createDB()
    return new Promise((resolve, reject) => {
        db.query(selectSQL, (error, results) => {
            if (error) reject(error)
            else resolve(results.map((item) => {
                return { 
                    ...item, 
                    lib: JSON.parse(item.lib), 
                    createAt: formatTime(item.createAt),
                    lastModified: formatTime(item.lastModified),
                }
            }))
        })
    })
}

module.exports = { selectJSON }