const util = require('util');

const exec = util.promisify(require('child_process').exec);

const buildReactProject = async (path) => {
    try {
        const command = `npm run build`;
        await exec(command, { cwd: path });
    } catch (error) {
        console.error('打包React项目时出现错误：', error.message);
    }
};


module.exports = {  buildReactProject }
