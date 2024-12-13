import crypto from "crypto";
import dotenv from "dotenv";
import axios from "axios";
import bcrypt from "bcryptjs";
import User from "../../model/User/user.model.js";
import Auth from "../../model/User/auth.model.js";

dotenv.config();

// Send reset password link
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Email: ", email)
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        } else {

            // Generate hash for password reset
            const currentDate = new Date().toLocaleString();
            const hash = createSHA256Hash(email + currentDate);

            // Store hash in DB against user
            const storeHash = new Auth({
                "email": email,
                "hash": hash
            });
            await storeHash.save();

            console.log("Stored Hash: ", storeHash)
            // Send email with reset link
            const response = await axios.post(`${process.env.MAIL_SERVER}/forgot-password`, {
                to: email,
                subject: "Password Reset Email - AGenC",
                hash: hash
            });
            console.log("Mail send to server: ", response.data)
            res.status(201).json({ message: "reset link sent" });
        }
    } catch (err) {
        if (err.code === 11000) {
            return res.status(200).json({ message: "Something went wrong while sending mail" });
            // or fetch the hash and resend mail with the rest link
        } else {
            console.log(`Error during forget password: ${err}`);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

// update password
export const resetPassword = async (req, res) => {
    try {
        const { secret, newPassword } = req.body; hash
        // Check if hash is valid
        const user = await Auth.findOne({ secret });
        if (!user) {
            return res.status(401).json({ message: "invalid url" });
        }
        // Hash the new password
        hash_password = await bcrypt.hash(newPassword, 10)
        // Update password of associated user
        const updatePassword = await User.updateOne({ "email": user.email }, { "password": hash_password });
        if (updatePassword.modifiedCount == 1) {
            await Auth.deleteOne({ "email": user.email })
                .then(() => {
                    return res.status(200).json({ message: "password updated successfully" })
                });
        }
    } catch (err) {
        console.log(`Error during reset password: ${err}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Function to create SHA-256 hash
const createSHA256Hash = (data) => {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
};