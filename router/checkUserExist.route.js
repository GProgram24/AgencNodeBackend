import express from 'express';
import User from "../model/User/user.model.js";

const router = express.Router();

// route to check email available
router.post("/", async (req, res) => {
    const email = req.body.email;
    if (email) {
        console.log(email);

        try {
            // Check if user already exists
            let userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: "unavailable" });
            }
            else {
                return res.status(201).json({ message: "available" });
            }


        } catch (error) {
            console.error("Error during signup:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    } else {
        return res.status(422).json({ message: "Invalid input" });
    }
});


export default router;