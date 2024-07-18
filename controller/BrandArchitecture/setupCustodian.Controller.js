import bcrypt from "bcryptjs";
import User from "../../model/User/user.model.js";
import Custodian from "../../model/User/custodian.model.js";
import Account from "../../model/Brand/account.model.js";
import { passwordGenerator } from "../authentication/passwordGenerator.controller.js";
import axios from "axios";

export const setupCustodian = async (req, res) => {
    const reqObj = req.body;
    console.log(reqObj);
    if (!Array.isArray(reqObj) || reqObj.length === 0) {
        return res.status(422).json({ message: 'Invalid input. Please provide an array of objects.' });
    }
    try {
        // Respond with return as other operations need to be completed
        // checking email already exist is not required since its is already checked via get-user route
        res.status(201).json({
            message: 'Successful'
        });

        // Generate passwords for all users
        const passwords = passwordGenerator(reqObj.length);

        // Add passwords to request objects for sending mail
        const usersWithPasswords = reqObj.map((user, index) => ({
            ...user,
            password: passwords[index]
        }));

        // Send email to users with their unhashed passwords
        for (const user of usersWithPasswords) {
            await axios.post(`${process.env.MAIL_SERVER}/new-user`, {
                to: user.email,
                subject: "Welcome to AGenC",
                organisation: user.account,
                userType: user.userType.charAt(0).toUpperCase() + user.userType.slice(1),
                name: user.name,
                password: user.password
            });
        }

        // Create object for account collection
        const accountObj = reqObj.map((object, index) => (
            { name: object.account }
        ))
        // Insert account into the database
        const createAccountsResponse = await Account.insertMany(accountObj)

        // Add hashed passwords to request objects and prepare for insertion
        const usersWithHashedPasswords = await Promise.all(
            reqObj.map(async (user, index) => ({
                ...user,
                password: await bcrypt.hash(passwords[index], 10),
                accountId: createAccountsResponse[index]._id
            }))
        );
        // Insert users into the database
        const createUsersResponse = await User.insertMany(usersWithHashedPasswords);

        // Create object for custodian collection
        const custodianObj = usersWithHashedPasswords.map((user, index) => ({
            ...user,
            userId: createUsersResponse[index]._id
        }));
        // Insert in respective userType collection
        const createUserTypeResponse = await Custodian.insertMany(custodianObj);
        console.log(createUserTypeResponse);

    } catch (error) {
        console.error("Error during creator setup: ", error);
    }
};
