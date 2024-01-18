const express = require('express');
const registerRouter = express.Router();
const { selectAccount, insertUser } = require('../../utils/sql/user/registerSQL')
const { sendFail, sendData } = require('../../utils/send')

async function createAccount() {
    let existAccount
    try {
        existAccount = await selectAccount()
    } catch (error) {
        existAccount = []
    } finally {
        let choices = 99999999999 - 10000;
        let account = Math.floor(Math.random() * choices + 10000);
        while (existAccount.indexOf(account) !== -1) account = Math.floor(Math.random() * choices + 10000);
        return account
    }
}

registerRouter.post('/', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return sendFail(res)

    try {
        const account = await createAccount()
        await insertUser(account, password, username)
        sendData(res, {
            account
        })
    } catch (error) {
        sendFail(res)
    }

});

module.exports = registerRouter;