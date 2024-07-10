import crypto from "crypto";
import User from "../../model/User/user.model.js";
import Auth from "../../model/User/auth.model.js";
import { sendMail } from "../mailSender/mail.controller.js";

// Send reset password link
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        };

        // Generate hash for password reset
        const currentDate = new Date().toLocaleString();
        const hash = createSHA256Hash(email + currentDate);

        // Store hash in DB against user
        const storeHash = new Auth({
            "email": email,
            "hash": hash
        });
        await storeHash.save();

        // Send email with reset link
        const mailResponse = await sendMail(email, "Password Reset Email - AGenC", htmlContent(hash));
        res.status(201).json({ message: "reset link sent" });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(200).json({ message: "time remaining" });
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
        const { secret, newPassword } = req.body;hash
        // Check if hash is valid
        const user = await Auth.findOne({ secret });
        if (!user) {
            return res.status(401).json({ message: "invalid url" });
        }
        // Update password of associated user
        const updatePassword = await User.updateOne({ "email": user.email }, { "password": newPassword });
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

// Below are helper functions for above routes
// Function to create SHA-256 hash
const createSHA256Hash = (data) => {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
};

// HTML body for password reset link
const htmlContent = (hash) => {
    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset Email - AGenC</title>
                <style>
                    .button {
                        display: inline-block;
                        font-size: 14px;
                        color: #ffffff;
                        background-color: #007bff;
                        border: none;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 4px;
                    }
                </style>
            </head>
            <body>
                <p>Hello,</p>
                <p>You have requested to reset your password. Please click the button below to reset your password:</p>
                <p><a class="button" href="https://agenc-frontend.vercel.app/reset-password/${hash}">Reset Password</a></p>
                <p><a class="button" href="https://agenc-frontend.vercel.app">Test Button</a></p>
                <p>The link is valid for only 30 minutes!</p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Thank you,<br>
                AGenC</p>
            </body>
            </html>`;
};