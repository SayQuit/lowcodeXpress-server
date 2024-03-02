const createDB = require('../../db')
const { formatTime } = require('../../time')

async function selectJSON(account, id) {
    const selectSQL = `select * from online where account = '${account}' and id = '${id}'`
    const db = await createDB()
    return new Promise((resolve, reject) => {
        db.query(selectSQL, (error, results) => {
            if (error || results.length !== 1) reject(error)
            else {
                resolve({
                    ...results[0],
                    element: JSON.parse(results[0].element),
                    createAt: formatTime(results[0].createAt),
                    lastModified: formatTime(results[0].lastModified),
                    variable: JSON.parse(results[0].variable),
                    event: JSON.parse(results[0].event),
                    props: JSON.parse(results[0].props),
                })
            }
        })
    })
}

module.exports = { selectJSON }