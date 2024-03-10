const express = require('express');
const projectRouter = express.Router();
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { sendFail, sendData } = require('../../utils/send');
const { getToken } = require('../../utils/jwt');
const { selectJSON } = require('../../utils/sql/project/detailSQL');
const { parseElementToFile, createDir, createReactProject } = require('../../utils/file/index')
const { generateJSXFile } = require('../../utils/file')
const path = require('path');
const fs = require('fs');
const { getRandomID } = require('../../utils/randomID');



projectRouter.post('/', async (req, res) => {
    const { headers } = req;
    const { id } = req.body;
    const token = getToken(headers);

    if (!token || !id) return sendFail(res);

    try {
        const userRow = await selectUser(token);
        const { account } = userRow;
        const detailRow = await selectJSON(account, id);
        const { element, name, type, tech, lib, variable, event, props, onload } = detailRow;
        const code = await parseElementToFile(element, name, type, tech, lib, variable, event, props, onload);
        const folderPath = `../../temp/${getRandomID()}`
        sendData(res, null)
        await createDir(folderPath)


        await createReactProject(name, folderPath)
        console.log('finish');
        // fs.unlink(path.join(__dirname, folderPath, `${name}.jsx`), () => { });

        // await createDir(`${folderPath}/xpress-app/src/component`)
        // generateJSXFile(code, name, `${folderPath}/xpress-app/src/component`);

        // 修改app.js组件

        // 压缩

        // const filePath = path.join(__dirname, folderPath, `${name}.zip`);

        // // 递归删除
        // fs.unlink(filePath, (err) => {
        //     if (!err) fs.rmdir(path.join(__dirname, folderPath), () => { })
        // });
    } catch (error) {
        sendFail(res);
    }
});

module.exports = projectRouter;