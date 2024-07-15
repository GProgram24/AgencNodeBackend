import bcrypt from "bcryptjs";
import User from "../../model/User/user.model.js";
import Creator from "../../model/User/creator.model.js";
import Brand from "../../model/Brand/brand.model.js";
import { passwordGenerator } from "../authentication/passwordGenerator.controller.js";
import axios from "axios";

export const setupCreator = async (req, res) => {
    const reqObj = req.body;

    if (!Array.isArray(reqObj) || reqObj.length === 0) {
        return res.status(422).json({ message: 'Invalid input. Please provide an array of objects.' });
    };
    try {
        // Respond with return as other operations need to be completed
        // checking email already exist is not required since its is already checked via /check route
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
                organisation: user.brand,
                userType: user.userType.charAt(0).toUpperCase() + user.userType.slice(1),
                name: user.name,
                password: user.password
            });
        }

        // Fetch account id using custodian mail from user collection
        const custodianEmail = reqObj[0].custodianMail;
        const accountIdResponse = await User.findOne({ "email": custodianEmail }).select("accountId");


        // Add hashed passwords to request objects and prepare for insertion
        const usersWithHashedPasswords = await Promise.all(
            reqObj.map(async (user, index) => ({
                ...user,
                accountId: accountIdResponse.accountId,
                password: await bcrypt.hash(passwords[index], 10)
            }))
        );

        // Insert users into the database
        const createUsersResponse = await User.insertMany(usersWithHashedPasswords);
        console.log(createUsersResponse);

        // Create object for creator collection
        const creatorsObj = reqObj.map((user, index) => ({
            name: user.name,
            userId: createUsersResponse[index]._id,
            parentId: accountIdResponse._id
        }));
        // Insert in respective userType collection
        const createUserTypeResponse = await Creator.insertMany(creatorsObj);
        console.log(createUserTypeResponse);

        // Create object for brand collection
        const brandsObj = reqObj.map((user, index) => ({
            name: user.brand,
            managedBy: createUserTypeResponse[index]._id,
            accountId: accountIdResponse.accountId
        }));
        // Insert in brand collection
        const createBrandResponse = await Brand.insertMany(brandsObj);
        console.log(createBrandResponse);

    } catch (error) {
        console.error("Error during creator setup: ", error);
    }
};
