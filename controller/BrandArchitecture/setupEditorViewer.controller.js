import bcrypt from "bcryptjs";
import User from "../../model/User/user.model.js";
import Editor from "../../model/User/editor.model.js";
import Viewer from "../../model/User/viewer.model.js";
import Brand from "../../model/Brand/brand.model.js";
import { passwordGenerator } from "../authentication/passwordGenerator.controller.js";
import axios from "axios";

const setupEditorViewer = async (req, res) => {
  const reqObj = req.body;

  if (!Array.isArray(reqObj) || reqObj.length === 0) {
    return res
      .status(422)
      .json({ message: "Invalid input. Please provide an array of objects." });
  }
  try {
    // checking email already exist is not required since its is already checked via /check route
    // Generate passwords for all users
    const passwords = passwordGenerator(reqObj.length);

    // Add passwords to request objects for sending mail
    const usersWithPasswords = reqObj.map((user, index) => ({
      ...user,
      password: passwords[index],
    }));

    // Fetch account id and creator id using brand name from brand collection, since brand name is unique
    const brandName = reqObj[0].brand;
    const brandResponse = await Brand.findOne({ name: brandName }).select([
      "managedBy",
      "accountId",
    ]);

    // Add hashed passwords and accountId to request objects and prepare for insertion
    const usersWithHashedPasswords = await Promise.all(
      reqObj.map(async (user, index) => ({
        ...user,
        password: await bcrypt.hash(passwords[index], 10),
        parentId: brandResponse.managedBy,
        accountId: brandResponse.accountId,
        brandId: brandResponse._id,
      }))
    );

    // Insert users into the database
    const createUsersResponse = await User.insertMany(usersWithHashedPasswords);

    // Send response and continue operations
    res.status(201).json({
      message: usersWithPasswords,
    });
    // Send email to users with their unhashed passwords
    for (const user of usersWithPasswords) {
      await axios.post(`${process.env.MAIL_SERVER}/new-user`, {
        to: user.email,
        subject: "Welcome to AGenC",
        organisation: user.brand,
        userType:
          user.userType.charAt(0).toUpperCase() + user.userType.slice(1),
        name: user.name,
        role: user.role,
        password: user.password,
      });
    }

    // Create object for editor/viewer collection
    const editorViewerObj = usersWithHashedPasswords.map((user, index) => ({
      ...user,
      userId: createUsersResponse[index]._id,
    }));
    // Insert in respective userType collection
    if (reqObj[0].userType == "editor") {
      const createUserTypeResponse = await Editor.insertMany(editorViewerObj);
    } else if (reqObj[0].userType == "viewer") {
      const createUserTypeResponse = await Viewer.insertMany(editorViewerObj);
    }
  } catch (err) {
    console.log("Error during editor/viewer setup: " + err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default setupEditorViewer;
