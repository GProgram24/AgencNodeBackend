import bcrypt from "bcryptjs";
import User from "../../model/User/user.model.js";
import Custodian from "../../model/User/custodian.model.js";
import Account from "../../model/Brand/account.model.js";
import { passwordGenerator } from "../authentication/passwordGenerator.controller.js";
import axios from "axios";

export const setupCustodian = async (req, res) => {
    const reqObj = req.body;
    // Check if request object is not blank
    if (!(reqObj.name && reqObj.email && reqObj.userType && reqObj.account)) {
        return res.status(422).json({ message: 'Insufficient data' });
    }
    try {
        // Generate passwords
        const passwords = passwordGenerator(1);

        // Add passwords to request objects for sending mail
        const usersWithPassword = {
            ...reqObj,
            password: passwords[0]
        };

        // Create object for account collection
        const accountObj = { name: reqObj.account }

        // Insert account into the database
        const createAccountsResponse = new Account(accountObj);
        await createAccountsResponse.save();

        // Add hashed passwords to request objects and prepare for insertion
        const usersWithHashedPassword = {
            ...reqObj,
            password: await bcrypt.hash(passwords[0], 10),
            accountId: createAccountsResponse._id
        };

        // Insert users into the database and send response
        const createUserResponse = new User(usersWithHashedPassword);
        await createUserResponse.save()
            .then(() => {
                res.status(201).json({
                    message: 'Successful'
                });
            });

        // Send email to users with their unhashed passwords
        await axios.post(`${process.env.MAIL_SERVER}/new-user`, {
            to: usersWithPassword.email,
            subject: "Welcome to AGenC",
            organisation: usersWithPassword.account,
            userType: usersWithPassword.userType.charAt(0).toUpperCase() + usersWithPassword.userType.slice(1),
            name: usersWithPassword.name,
            password: usersWithPassword.password
        });

        // Create object for custodian collection
        const custodianObj = {
            ...usersWithHashedPassword,
            userId: createUserResponse._id
        };
        // Insert in respective userType collection
        const createUserTypeResponse = new Custodian(custodianObj);
        await createUserTypeResponse.save();

    } catch (error) {
        // For duplicate key error
        if (error.code == 11000) {
            return res.status(400).json({ message: "User/Account exists" });
        }
        // Any other error
        console.error("Error during creator setup: ", error);
        return res.status(500).json({ message: "Server error" });
    }
};
