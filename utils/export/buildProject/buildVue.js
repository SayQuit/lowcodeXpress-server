const util = require('util');

const exec = util.promisify(require('child_process').exec);

const buildVueProject = async (path) => {
    try {
        const command = `npm run build`;
        await exec(command, { cwd: path });
    } catch (error) {
        console.error('打包vue项目时出现错误：', error.message);
    }
};


module.exports = {  buildVueProject }
