const createDB = require('../../db')
const { formatTime } = require('../../time')

async function selectJSON(account) {
    const selectSQL = `select createAt, id, name, description, type, tech, lib, lastModified from project where account = '${account}' order by createAt DESC;`
    const db = await createDB()
    return new Promise((resolve, reject) => {
        db.query(selectSQL, (error, results) => {
            if (error) reject(error)
            else resolve(results.map((item) => {
                return { 
                    ...item, 
                    lib: JSON.parse(item.lib), 
                    createAt: formatTime(results[0].createAt),
                    lastModified: formatTime(results[0].lastModified),
                }
            }))
        })
    })
}

module.exports = { selectJSON }