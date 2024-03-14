const util = require('util');
const exec = util.promisify(require('child_process').exec);

const installLib = async (lib, tech, installPath) => {
    if (lib.includes('ant-design')) {
        if (tech === 'react') await installAntd(installPath, 'antd')
        else if (tech === 'vue') await installAntd(installPath, 'ant-design-vue')
    }
};

const installAntd = async (installPath, name) => {
    try {
        console.log( `npm install ${name}`);
        const command = `npm install ${name}`;
        await exec(command, { cwd: installPath });
        console.log('success');
    } catch (error) {
        console.error('下载antd项目时出现错误：', error.message);
    }
};

module.exports = { installLib }