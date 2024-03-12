const { createReactProject } = require("./creatReact")
const { createVueProject } = require("./createVue")


const createProject = async (name, newPath, tech) => {
    if (tech === 'react') await createReactProject(name, newPath)
    else if (tech === 'vue') await createVueProject(name,newPath)
}


module.exports = { createProject }