import oAuthClientCredentialsModel from "../../model/platform/oAuthClientCredentials.model.js"

// Get available platforms from database
export const getPlatform = async (req, res) => {
    try {
        // fetch all platforms from database and send the names in response
        const getPlatforms = await oAuthClientCredentialsModel.find();
        const platforms = getPlatforms.map(item => item.platform);
        return res.status(200).json({ message: platforms });
    } catch (error) {
        console.log("Error at fetching platforms:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

// Add platform to database
export const addPlatform = async (req, res) => {
    try {
        if (req.body.devToken == "prabhaT2608") {
            const reqObj = req.body;
            console.log(reqObj);
            const clientPlatform = new oAuthClientCredentialsModel(reqObj);
            await clientPlatform.save();
            console.log(clientPlatform);
            return res.status(200).json({ message: "Added platform to database" });
        } else {
            return res.status(401).json({ message: "Imposter" });
        }
    } catch (error) {
        console.log("Error at adding platform:", error);
        return res.status(500).json({ message: "Server error" });
    }

}