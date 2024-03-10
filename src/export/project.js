const express = require('express');
const projectRouter = express.Router();
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { sendFail, sendData } = require('../../utils/send');
const { getToken } = require('../../utils/jwt');
const { selectJSON } = require('../../utils/sql/project/detailSQL');
const { parseElementToFile, createReactProject, modifyReactAppFile, createDir } = require('../../utils/file/index')
const { generateJSXFile } = require('../../utils/file')
const path = require('path');
const { getRandomID } = require('../../utils/randomID');
const { insertJSON } = require('../../utils/sql/export/createSQL');
const { toHyphenCase } = require('../../utils/str');



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
        const folderPath = path.join(__dirname, `../../temp/${getRandomID()}`)
        await insertJSON(folderPath, name, account)
        sendData(res, null)
        await createDir(folderPath)
        await createReactProject(name, folderPath)
        generateJSXFile(code, name, path.join(folderPath, toHyphenCase(name), 'src', 'component'));
        modifyReactAppFile(path.join(folderPath, toHyphenCase(name), 'src', 'App.js'), name)


        // 压缩
        // const filePath = path.join(folderPath, `${name}.zip`);

        // // 递归删除
        // fs.unlink(filePath, (err) => {
        //     if (!err) fs.rmdir(path.join(__dirname, folderPath), () => { })
        // });
    } catch (error) {
        console.log(error);
        sendFail(res);
    }
});

module.exports = projectRouter;