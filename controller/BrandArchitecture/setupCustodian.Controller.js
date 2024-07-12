// random password generate
// create user document with account ref
// create custodian document with account ref
// create brand document with creator ref

import bcrypt from "bcryptjs";
import User from "../../model/User/user.model.js";
import Custodian from "../../model/User/custodian.model.js";
import Account from "../../model/Brand/account.model.js";
import { sendMail } from "../mailSender/mail.controller.js";
import { passwordGenerator } from "../authentication/passwordGenerator.controller.js";

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
        // const usersWithPasswords = reqObj.map((user, index) => ({
        //     ...user,
        //     password: passwords[index]
        // }));

        // Send email to users with their new passwords
        // for (const user of usersWithPasswords) {
        //     console.log(await sendMail(
        //         user.email,
        //         'Welcome to AGenC',
        //         emailBody(
        //             user.brand,
        //             user.userType.charAt(0).toUpperCase() + user.userType.slice(1),
        //             user.name,
        //             user.password
        //         )
        //     ));
        // }

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

/*
const emailBody = (account, userType, name, password) => {
    return `<html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            color: #333;
                            line-height: 1.6;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #444;
                        }
                        p {
                            margin: 10px 0;
                        }
                        .footer {
                            margin-top: 20px;
                            text-align: center;
                            color: #777;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Welcome to ${account}!</h1>
                        <p>Dear ${name},</p>
                        <p>We're excited to have you on board with AGenC platform as a ${userType}.<br> Here are your login credentials:</p>
                        <p><strong>Password:</strong> ${password}</p>
                        <p>Please keep this information secure and do not share it with anyone.</p>
                        <p>Best regards,<br>
                        Team AGenC</p>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} AGenC. All rights reserved.</p>
                        </div>
                    </div>
                </body>
            </html>
            `
}*/
