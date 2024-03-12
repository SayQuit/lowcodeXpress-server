const { buildReactProject } = require("./buildReact")
const { buildVueProject } = require("./buildVue")


const buildProject = async (path, tech) => {
    if (tech === 'react') await buildReactProject(path)
    else if (tech === 'vue') await buildVueProject(path)
}

module.exports = { buildProject }