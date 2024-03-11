const { createReactProject } = require("./creatReact")
const { createVueProject } = require("./createVue")


const createProject = async (name, newPath) => {
    await createReactProject(name, newPath)
    // await createVueProject(name,newPath)
}


module.exports = { createProject }