import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../model/user.model.js";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

// Controller function for user login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
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
        }

        // User authenticated, generate token
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });

        // Return the token
        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
            },
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};