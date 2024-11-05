import bcrypt from "bcryptjs";
import User from "../../model/User/user.model.js";
import Creator from "../../model/User/creator.model.js";
import Custodian from "../../model/User/custodian.model.js";
import Brand from "../../model/Brand/brand.model.js";
import { passwordGenerator } from "../authentication/passwordGenerator.controller.js";
import axios from "axios";
import Account from "../../model/Brand/account.model.js";

export const setupCreator = async (req, res) => {
  const reqObj = req.body;
  const accountType = req.params.accountType; // Fetch the accountType from route parameter

  if (!Array.isArray(reqObj) || reqObj.length === 0) {
    return res
      .status(422)
      .json({ message: "Invalid input. Please provide an array of objects." });
  }

  try {
    // Server-side check: For Lite accounts, only one creator for a single brand can be added
    if (accountType === "lite") {
      const accountName = reqObj[0].account;

      // Fetch the account's ObjectId using the account name
      const accountIdResponse = await Account.findOne({
        name: accountName,
      }).select("_id");

      if (!accountIdResponse) {
        return res.status(404).json({ message: "Account not found" });
      }

      // Use the accountId (ObjectId) to check for an existing brand
      const existingBrand = await Brand.findOne({
        accountId: accountIdResponse._id,
      });

      if (existingBrand) {
        return res.status(400).json({
          message: "Lite accounts can only have one creator for one brand.",
        });
      }
    }

    // Generate passwords for all users
    const passwords = passwordGenerator(reqObj.length);

    // Add passwords to request objects for sending mail
    const usersWithPasswords = reqObj.map((user, index) => ({
      ...user,
      password: passwords[index],
    }));

    // Fetch account id using custodian mail from user collection
    const accountName = reqObj[0].account;
    const accountIdResponse = await Account.findOne({
      name: accountName,
    }).select("_id");

    // Get custodian id from custodian collection for parentId field, using _id from account collection
    const custodianIdResponse = await Custodian.findOne({
      accountId: accountIdResponse._id,
    }).select("_id");

    // Add hashed passwords to request objects and prepare for insertion
    const usersWithHashedPasswords = await Promise.all(
      reqObj.map(async (user, index) => ({
        ...user,
        accountId: accountIdResponse._id,
        password: await bcrypt.hash(passwords[index], 10),
      }))
    );

    // Insert users into the database
    const createUsersResponse = await User.insertMany(usersWithHashedPasswords);
    res.status(201).json({
      message: "Successful",
      data: usersWithPasswords,
    });

    // Send email to users with their unhashed passwords (for both lite and pro)
    for (const user of usersWithPasswords) {
      await axios.post(`${process.env.MAIL_SERVER}/new-user`, {
        to: user.email,
        subject: "Welcome to AGenC",
        organisation: user.brand,
        userType:
          user.userType.charAt(0).toUpperCase() + user.userType.slice(1),
        name: user.name,
        password: user.password,
      });
    }

    // Create object for creator collection
    const creatorsObj = reqObj.map((user, index) => ({
      name: user.name,
      userId: createUsersResponse[index]._id,
      parentId: custodianIdResponse._id,
    }));
    // Insert in respective userType collection
    const createUserTypeResponse = await Creator.insertMany(creatorsObj);

    // Create object for brand collection
    const brandsObj = reqObj.map((user, index) => ({
      name: user.brand,
      managedBy: createUserTypeResponse[index]._id,
      accountId: accountIdResponse._id,
    }));
    // Insert in brand collection
    const createBrandResponse = await Brand.insertMany(brandsObj);
  } catch (err) {
    console.log("Error during creator setup: " + err);
    if (err.code == 11000) {
      return res.status(400).json({ message: "User/Account exists" });
    } else {
      return res.status(500).json({ message: "Server error" });
    }
  }
};
