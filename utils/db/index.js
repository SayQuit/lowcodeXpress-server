const mysql = require('mysql');
require('dotenv').config();

let db = null
async function createDB() {
    return new Promise((resolve, reject) => {
        try {
            db = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });
            resolve(db)
        } catch (error) {
            reject(db)
        }
    })
}
module.exports = createDB

