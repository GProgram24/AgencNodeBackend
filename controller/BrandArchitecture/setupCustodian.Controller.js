import bcrypt from "bcryptjs";
import User from "../../model/User/user.model.js";
import Custodian from "../../model/User/custodian.model.js";
import Account from "../../model/Brand/account.model.js";
import { passwordGenerator } from "../authentication/passwordGenerator.controller.js";
import axios from "axios";

export const setupCustodian = async (req, res) => {
  const reqObj = req.body;

  const accountType = req.params.accountType; // Fetch the accountType from route parameter

  // Check if request object is not blank
  if (!(reqObj.name && reqObj.email && reqObj.userType && reqObj.account)) {
    return res.status(422).json({ message: "Insufficient data" });
  }

  try {
    // Generate passwords
    const passwords = passwordGenerator(1);

    // Add passwords to request objects for sending mail
    const userwithpassword = {
      ...reqObj,
      password: passwords[0],
    };

    // Create object for account collection
    const accountObj = {
      name: reqObj.account,
      accountType: accountType, // Include the accountType in the account creation
    };

    // Insert account into the database
    const createAccountsResponse = new Account(accountObj);
    await createAccountsResponse.save();

    // Add hashed passwords to request objects and prepare for insertion
    const userWithHashedPassword = {
      ...reqObj,
      password: await bcrypt.hash(passwords[0], 10),
      accountId: createAccountsResponse._id,
    };

    // Insert user into the database
    const createUserResponse = new User(userWithHashedPassword);
    await createUserResponse.save().then(() => {
      res.status(201).json({
        message: "Successful",
        data: userwithpassword,
      });
    });

    // Send email to the user only if the accountType is 'pro'
    if (accountType === "pro") {
      await axios.post(`${process.env.MAIL_SERVER}/new-user`, {
        to: userwithpassword.email,
        subject: "Welcome to AGenC",
        organisation: userwithpassword.account,
        userType:
          userwithpassword.userType.charAt(0).toUpperCase() +
          userwithpassword.userType.slice(1),
        name: userwithpassword.name,
        password: userwithpassword.password,
      });
    }

    // Create object for custodian collection
    const custodianObj = {
      ...userWithHashedPassword,
      userId: createUserResponse._id,
    };

    // Insert in custodian collection (even for Lite accounts)
    const createUserTypeResponse = new Custodian(custodianObj);
    await createUserTypeResponse.save();
  } catch (error) {
    // For duplicate key error
    if (error.code == 11000) {
      return res.status(400).json({ message: "User/Account exists" });
    }
    // Any other error
    console.error("Error during custodian setup: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};
