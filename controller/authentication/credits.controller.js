import creditModel from "../../model/User/credit.model.js";

export const getCredit = async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({
            message: "User ID is required",
        });
    }
    try {
        const credit = await creditModel.findOne({userId: userId});

        if (!credit) {
            return res.status(404).json({
                message: "No credit information found for this user.",
            });
        }

        return res.status(200).send( {credits: credit.credits} );

    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch user credit. Please try again later.",
            error: error.message, // Optional: can remove to hide internal errors from client
        });
    }
};
