const express = require('express');
const registerRouter = express.Router();
const { selectAccount, insertUser } = require('../../utils/sql/user/registerSQL')
const { sendFail, sendData } = require('../../utils/send')

async function createAccount() {
    const existAccount = await selectAccount() || []
    var choices = 99999999999 - 10000;
    let account = Math.floor(Math.random() * choices + 10000);
    while (existAccount.indexOf(account) !== -1) account = Math.floor(Math.random() * choices + 10000);
    return account
}

registerRouter.post('/', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return sendFail(res)

    const account = await createAccount()
    const row = await insertUser(account, password, username)
    if (!row) return sendFail(res)

    return sendData(res, {
        account
    })


});

module.exports = registerRouter;