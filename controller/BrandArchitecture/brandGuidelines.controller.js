import brandModel from "../../model/Brand/brand.model.js";
import brandGuidelinesModel from "../../model/Brand/brandGuidelines.model.js";

const createBrandGuidelines = async (req, res) => {
    try {
        const { guidelinesObj } = req.body;

        if (!guidelinesObj) {
            return res.status(400).send("No data received");
        }

        const brandId = guidelinesObj.brandId;

        const alreadyExists = await brandGuidelinesModel.find({brandId: brandId})
        if(alreadyExists){
            return res.status(404).send("Can't upload Brand Guidelines again!")
        }

        const brand = await brandModel.findById(brandId);
        if (!brand) {
            return res.status(404).send("Invalid brand data");
        }

        const tones = guidelinesObj.toneOfVoice?.tones || {};
        for (const [toneName, toneDetails] of Object.entries(tones)) {
            if (!toneDetails.examples || !Array.isArray(toneDetails.examples)) {
                return res.status(400).send(`Invalid tone structure for "${toneName}": examples must be an array.`);
            }
            for (const example of toneDetails.examples) {
                if (!example.message || !example.context) {
                    return res
                        .status(400)
                        .send(`Invalid example in tone "${toneName}": each example must have a "message" and "context".`);
                }
            }
        }

        const newGuideline = new brandGuidelinesModel({
            brandId: brandId,
            brandMessage: guidelinesObj.brandMessage,
            toneOfVoice: {
                description: guidelinesObj.toneOfVoice?.description || "",
                tones: guidelinesObj.toneOfVoice?.tones || {}
            },
            colorDescription: guidelinesObj.colorDescription,
            socialMediaGuidelines: {
                recommendedHashtags: guidelinesObj.socialMediaGuidelines?.recommendedHashtags || [],
                toneForPost: guidelinesObj.socialMediaGuidelines?.toneForPost || ""
            },
            additionalNotes: guidelinesObj.additionalNotes || ""
        });

        await newGuideline.save();

        res.status(201).send("Brand guidelines saved successfully!");
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!",
            error: error.message
        });
    }
};


const updateBrandGuidelines = async (req, res) => {
    try {
        const { reqObj } = req.body;

        if (!reqObj || !reqObj.brandId) {
            return res.status(400).send("Brand ID is required.");
        }

        const brandId = reqObj.brandId;

        // Check if the brand exists
        const brand = await brandModel.findById(brandId);
        if (!brand) {
            return res.status(404).send("Brand not found.");
        }

        // Check if brand guidelines exist
        const existingGuidelines = await brandGuidelinesModel.findOne({ brandId: brandId });
        if (!existingGuidelines) {
            return res.status(404).send("Brand guidelines not found.");
        }

        // Validate tones if provided
        if (reqObj.toneOfVoice?.tones) {
            const tones = reqObj.toneOfVoice.tones;
            for (const [toneName, toneDetails] of Object.entries(tones)) {
                if (!toneDetails.examples || !Array.isArray(toneDetails.examples)) {
                    return res.status(400).send(`Invalid tone structure for "${toneName}": examples must be an array.`);
                }
                for (const example of toneDetails.examples) {
                    if (!example.message || !example.context) {
                        return res
                            .status(400)
                            .send(`Invalid example in tone "${toneName}": each example must have a "message" and "context".`);
                    }
                }
            }
        }

        // Update brand guidelines dynamically based on provided fields
        const updatedFields = {};

        if (reqObj.brandMessage) {
            updatedFields.brandMessage = reqObj.brandMessage;
        }

        if (reqObj.toneOfVoice) {
            updatedFields.toneOfVoice = reqObj.toneOfVoice;
        }

        if (reqObj.colorDescription) {
            updatedFields.colorDescription = reqObj.colorDescription;
        }

        if (reqObj.socialMediaGuidelines) {
            updatedFields.socialMediaGuidelines = reqObj.socialMediaGuidelines;
        }

        if (reqObj.additionalNotes) {
            updatedFields.additionalNotes = reqObj.additionalNotes;
        }

        // Perform the update
        const updatedGuidelines = await brandGuidelinesModel.findOneAndUpdate(
            { brandId: brandId },
            { $set: updatedFields },
            { new: true }
        );

        res.status(200).send({
            message: "Brand guidelines updated successfully.",
            updatedGuidelines,
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

const getBrandGuidelines = async (req, res) => {
    // Access brandId from URL params
    const { brandId } = req.query;

    // Validate brandId
    if (!brandId) {
        return res.status(404).send("Brand Id is required!");
    }

    try {
        // Query to fetch brand guidelines using brandId
        const brandGuidelines = await brandGuidelinesModel.find({ brandId: brandId });

        // If no guidelines found, return a 404 response
        if (!brandGuidelines || brandGuidelines.length === 0) {
            return res.status(404).send("Brand guidelines not found for the given Brand ID.");
        }

        // Return the found guidelines
        res.status(200).json(brandGuidelines);
    } catch (error) {
        // Handle any unexpected errors
        return res.status(500).json({
            message: "Something Went Wrong!",
            error: error.message
        });
    }
};




export {createBrandGuidelines, updateBrandGuidelines, getBrandGuidelines}