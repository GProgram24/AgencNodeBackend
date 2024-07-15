import User from "../../model/User/user.model.js";
import Brand from "../../model/Brand/brand.model.js";
import Account from "../../model/Brand/brand.model.js";

// check email availability
export const emailAvailability = async (req, res) => {
    const email = req.body.email;
    if (email) {
        const emailCheckResponse = await User.findOne({ "email": email });
        if (!emailCheckResponse) {
            return res.status(201).json({ message: "available" });
        } else {
            return res.status(400).json({ message: "unavailable" });
        }
    } else {
        return res.status(422).json({ message: "Invalid request" });
    }
}

// Check account name availability
export const accountAvailability = async (req, res) => {
    const accountName = req.body.accountName;
    if (accountName) {
        const accountCheckResponse = await Account.findOne({ "name": accountName });
        if (!accountCheckResponse) {
            return res.status(201).json({ message: "available" });
        } else {
            return res.status(400).json({ message: "unavailable" });
        }
    } else {
        return res.status(422).json({ message: "Invalid request" });
    }
}

// Check brand name availability
export const brandAvailability = async (req, res) => {
    const brandName = req.body.brandName;
    if (brandName) {
        const brandCheckResponse = await Brand.findOne({ "name": brandName });
        if (!brandCheckResponse) {
            return res.status(201).json({ message: "available" });
        } else {
            return res.status(400).json({ message: "unavailable" });
        }
    } else {
        return res.status(422).json({ message: "Invalid request" });
    }
}