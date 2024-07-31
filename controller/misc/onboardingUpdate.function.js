import mongoose from "mongoose";
import Creator from "../../model/User/creator.model.js";

export const updateOnboardingProgress = async (req, res) => {
    const { userId, progress } = req.body;
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(404).json("Invalid userId");
    }

    if (typeof progress !== 'number' || progress < 0 || progress > 7) {
        return res.status(422).json("Invalid progress value");
    }

    try {
        const updatedCreator = await Creator.findOneAndUpdate(
            { userId: userId },
            { onboardingProgress: progress },
            { new: true }
        );

        if (!updatedCreator) {
            return res.status(500).json("cannot update");
        }

        return res.status(201).json("successful");
    } catch (error) {
        console.log("Error at updating onboarding:", error);
        return res.status(500).json("error");
    }
};
