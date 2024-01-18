const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

const currentFolderPath = path.dirname(__filename);
const txtFilePath = path.join(currentFolderPath, 'db_password.txt');
let db = null
fs.readFile(txtFilePath, 'utf8', (err, data) => {
    if (err) {
    } else {
        password = data
        db = mysql.createPool({
            host: "localhost",
            user: "root",
            password: data,
            database: "_test7",
        });
    }
});
async function createDB() {
    return new Promise((resolve, reject) => {
        fs.readFile(txtFilePath, 'utf8', (error, password) => {
            if (error) reject(error)
            db = mysql.createPool({
                host: "localhost",
                user: "root",
                password,
                database: "_test7",
            });
            resolve(db)
        });
    })
}
module.exports = createDB

