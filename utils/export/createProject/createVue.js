const { toHyphenCase } = require('../../str');
const util = require('util');

const exec = util.promisify(require('child_process').exec);

const createVueProject = async (name, path) => {
    exec('vue --version', (err) => {
        if (err) {
            console.error('请确保已经安装vue');
            return;
        }

        const command = `vue create ${toHyphenCase(name)}`;
        const options = {
            cwd: path.resolve(path || process.cwd()),
            stdio: 'inherit',
        };

        exec(command, options, () => { });
    });
};

module.exports = { createVueProject }