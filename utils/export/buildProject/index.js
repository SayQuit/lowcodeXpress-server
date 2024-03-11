const { buildReactProject } = require("./buildReact")


const buildProject = async (path) => {
    await buildReactProject(path)
}

module.exports = { buildProject }