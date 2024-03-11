
const { toHyphenCase } = require('../../str');
const util = require('util');
const exec = util.promisify(require('child_process').exec);


const createReactProject = async (name, newPath) => {
    try {
        const command = `npx create-react-app ${toHyphenCase(name)}`;
        await exec(command, { cwd: newPath });
    } catch (error) {
        console.error('创建React项目时出现错误：', error.message);
    }
};

module.exports = { createReactProject }