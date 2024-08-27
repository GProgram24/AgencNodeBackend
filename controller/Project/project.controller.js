export const createProject = async (req, res) => {
    res.status(200).json({message:"create project controller"})
}

export const getAllProject = async (req, res) => {
    res.status(200).json({message:"get all projects controller"})
}

export const getProject = async (req, res) => {
    res.status(200).json({message:"get specific project controller"})
}

export const addContent = async (req, res) => {
    res.status(200).json({message:"add content controller"})
}

export const removeContent = async (req, res) => {
    res.status(200).json({message:"remove content controller"})
}

export const deleteProject = async (req, res) => {
    res.status(200).json({message:"delete project controller"})
}