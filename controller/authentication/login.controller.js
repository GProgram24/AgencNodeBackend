import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../model/User/user.model.js";
import Viewer from "../../model/User/viewer.model.js";
import Editor from "../../model/User/editor.model.js";
import Creator from "../../model/User/creator.model.js";
import Custodian from "../../model/User/custodian.model.js";
import Account from "../../model/Brand/account.model.js";
import Brand from "../../model/Brand/brand.model.js";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

// Mapping user types to their respective models
const userTypeModels = {
    viewer: Viewer,
    editor: Editor,
    creator: Creator,
    custodian: Custodian,
};

// Controller function for user login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user based on email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        } else {
            // Fetch user details from the specific collection
            const UserTypeModel = userTypeModels[user.userType];
            const userDetails = await UserTypeModel.findOne({ userId: user._id });

            if (!userDetails) {
                return res.status(404).json({ message: "User details not found" });
            }

            let brandDetails = {};
            // Fetch brand details for creator
            if (user.userType == "creator") {
                brandDetails = await Brand.findOne({ managedBy: userDetails._id });
            }
            else if (user.userType == "editor" || user.userType == "viewer") {
                const creatorDetails = await Creator.findOne({ _id: userDetails.parentId });
                brandDetails = await Brand.findOne({ managedBy: creatorDetails._id });
            }
            // Fetch account details
            const accountDetails = await Account.findOne({ _id: user.accountId });

            // User authenticated, generate token
            const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });
            
            // Return the token
            return res.json({
                token,
                user: {
                    _id: user._id,
                    userTypeId: userDetails._id,
                    name: userDetails.name,
                    email: user.email,
                    userType: user.userType,
                    role: userDetails.role || null,
                    onboardingProgress: userDetails.onboardingProgress !== undefined && userDetails.onboardingProgress !== null ? userDetails.onboardingProgress : null,
                    accountName: accountDetails.name || null,
                    brandName: brandDetails.name || null,
                    active: accountDetails.active
                },
            });
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};