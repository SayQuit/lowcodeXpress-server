const createDB = require('../../db')
const { formatTime } = require('../../time')

async function selectJSON(account) {
    const selectSQL = `select * from onlineProject where account = '${account}' order by createAt DESC;`
    const db = await createDB()
    return new Promise((resolve, reject) => {
        db.query(selectSQL, (error, results) => {
            if (error) reject(error)
            else resolve(results.map((item) => {
                return {
                    ...item,
                    createAt: formatTime(item.createAt),
                    lib: JSON.parse(item.lib)
                }
            }))
        })
    })
}

module.exports = { selectJSON }