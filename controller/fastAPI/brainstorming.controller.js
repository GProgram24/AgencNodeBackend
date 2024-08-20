import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const brainstorming = async (req, res) => {
    return res.status(200).json("brainstorming")
}