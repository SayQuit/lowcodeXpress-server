const { toHyphenCase } = require('../../str');
const util = require('util');

const exec = util.promisify(require('child_process').exec);

const createVueProject = async (name, newPath) => {
    try {
        const command = `vue create ${toHyphenCase(name)} --default`;
        await exec(command, { cwd: newPath });
    } catch (error) {
        console.error('创建React项目时出现错误：', error.message);
    }
};

module.exports = { createVueProject }