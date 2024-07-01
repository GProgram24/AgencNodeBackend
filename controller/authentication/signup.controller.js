import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../model/user.model.js";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

// Controller function for user registration
export const registerUser = async (req, res) => {
    const { email, password } = req.body;
    const userObj = req.body;

    try {
        // Check if user already exists
        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        userObj.password = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User(userObj);

        // Save the user to the database
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, SECRET_KEY, { expiresIn: "1h" });

        // Return the token and any additional user data as needed
        res.status(201).json({
            token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                userType: newUser.userType,
            },
        });

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
