const { buildReactProject } = require("./buildReact")


const buildProject = async (path, tech) => {
    if (tech === 'react') await buildReactProject(path)
    // else if (tech === 'vue')
}

module.exports = { buildProject }