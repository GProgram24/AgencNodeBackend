import mongoose from "mongoose";
import SampleTesting from "../../model/sampleTestingTask.model.js";
import Brand from "../../model/Brand/brand.model.js";
import Editor from "../../model/User/editor.model.js";
import Viewer from "../../model/User/viewer.model.js";
import productService from "../../model/Brand/productService.model.js";
import targetAudience from "../../model/targetAudience.model.js";
import Creator from "../../model/User/creator.model.js";
import User from "../../model/User/user.model.js";

// Function to assign verticals task based on accountType (Pro/Lite)
export const divideSampleContentTask = async (brandName, accountType) => {
  console.log("Recieved account type", accountType);

  try {
    // Get brandId
    if (brandName) {
      const brand = await Brand.findOne({ name: brandName });
      if (!brand) {
        return "Brand not found";
      }

      // Fetch the creator
      const creatorId = brand.managedBy; // Get creatorId to assign tasks

      // Fetch products associated with the brand
      const products = await productService.find({ brand: brand._id });

      // Fetch target audience data for the products
      const productIds = products.map((product) => product._id);
      const productTargetAudience = await targetAudience.find({
        productServiceId: { $in: productIds },
      });

      // Map the products to their target audiences
      const productsWithAudience = products.map((product) => {
        const meta = productTargetAudience.find((meta) =>
          meta.productServiceId.equals(product._id)
        );
        return {
          productId: product._id,
          productName: product.name,
          targetAudience: meta ? meta.targetAudience : [],
        };
      });

      // For Lite accounts, assign tasks only based on product * target audience (no verticals)
      if (accountType === "lite") {
        console.log(
          "Lite account detected: Assigning product-target audience tasks to the creator."
        );

        const taskAssign = [];

        // Create a task list based on products and target audiences
        productsWithAudience.forEach((product) => {
          product.targetAudience.forEach((audience) => {
            taskAssign.push({
              userId: creatorId, // Assign all tasks to the creator
              task: {
                productId: product.productId,
                productName: product.productName,
                targetAudience: [audience],
              },
            });
          });
        });

        // Insert assigned tasks into the database
        const assignInsertResponse = await SampleTesting.insertMany(taskAssign);
        console.log(assignInsertResponse);

        return "successful";
      }

      // For Pro accounts, proceed with vertical-based task assignment
      const verticalGroups = {
        longForm: [creatorId],
        automation: [creatorId],
        performance: [creatorId],
        community: [creatorId],
      };

      if (accountType === "pro") {
        const editors = await Editor.find({ brandId: brand._id }).select([
          "_id",
          "-parentId",
          "-createdAt",
          "-updatedAt",
          "-__v",
        ]);
        const viewers = await Viewer.find({ brandId: brand._id }).select([
          "_id",
          "-parentId",
          "-createdAt",
          "-updatedAt",
          "-__v",
        ]);

        // Assign editors to respective vertical groups
        editors.forEach((editor) => {
          editor.role.forEach((role) => {
            if (verticalGroups[role]) {
              verticalGroups[role].push(editor.userId);
            }
          });
        });

        // Assign viewers to respective vertical groups
        viewers.forEach((viewer) => {
          viewer.role.forEach((role) => {
            if (verticalGroups[role]) {
              verticalGroups[role].push(viewer.userId);
            }
          });
        });

        // Create a task list for assignment based on products and target audiences
        const taskList = [];
        productsWithAudience.forEach((product) => {
          product.targetAudience.forEach((audience) => {
            taskList.push({
              productId: product.productId,
              productName: product.productName,
              targetAudience: [audience],
            });
          });
        });

        // Assign tasks to relevant users in a round-robin manner across verticals
        const taskAssign = [];

        Object.keys(verticalGroups).forEach((vertical) => {
          const users = verticalGroups[vertical];
          const nUsers = users.length;
          let index = 0;
          taskList.forEach((task) => {
            taskAssign.push({
              userId: users[index % nUsers],
              task: task,
            });
            index += 1;
          });
        });

        // Insert assigned tasks into the database
        const assignInsertResponse = await SampleTesting.insertMany(taskAssign);
        return "successful";
      } else {
        return "Invalid request";
      }
    }
  } catch (error) {
    console.log("Error at assigning vertical tasks:", error);
    return "Server error";
  }
};

export const getSampleTestingTask = async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from query parameters
    console.log(`Received user ID: ${userId}`);

    if (mongoose.isValidObjectId(userId)) {
      const tasks = await SampleTesting.find({ userId: userId });
      return res.status(200).json({ message: tasks });
    } else {
      return res.status(401).json({ message: "Invalid user" });
    }
  } catch (error) {
    console.log("Error at fetching sample testing task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCollaboratorsByVertical = async (req, res) => {
  try {
    const { brandName } = req.params;
    const { vertical } = req.query;

    // Find the brand and get its ID
    const brand = await Brand.findOne({ name: brandName });
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    // Get the creator (by default in all verticals) using the managedBy field in the brand model
    const creator = await Creator.findOne({ _id: brand.managedBy }).select(
      "name userId"
    );

    // Initialize arrays to store user IDs for batch fetching user details (including email)
    let userIds = [creator?.userId]; // Always include the creator

    // Function to fetch collaborators for a specific vertical
    const fetchCollaborators = async (vertical) => {
      const editors = await Editor.find({
        brandId: brand._id,
        role: vertical,
      }).select("userId name");
      const viewers = await Viewer.find({
        brandId: brand._id,
        role: vertical,
      }).select("userId name");

      // Add user IDs from editors and viewers to the array
      userIds.push(...editors.map((editor) => editor.userId));
      userIds.push(...viewers.map((viewer) => viewer.userId));

      // Combine creator, editors, and viewers for this vertical
      return [creator, ...editors, ...viewers].filter(Boolean);
    };

    let collaborators;
    if (
      vertical &&
      ["longform", "performance", "automation", "community"].includes(vertical)
    ) {
      collaborators = await fetchCollaborators(vertical);
    } else {
      collaborators = [];
      for (const vert of [
        "longform",
        "performance",
        "automation",
        "community",
      ]) {
        collaborators.push(...(await fetchCollaborators(vert)));
      }
    }

    // Fetch all users' details in a single query
    const users = await User.find({ _id: { $in: userIds } }).select(
      "email userType _id"
    );

    // Create a map for faster lookup of user details (email, userType) by userId
    const userMap = new Map(users.map((user) => [user._id.toString(), user]));

    // Map collaborators and attach email and userType from the userMap
    const collaboratorsWithDetails = collaborators.map((collaborator) => {
      const userDetails = userMap.get(collaborator.userId.toString());
      return {
        id: collaborator.userId,
        name: collaborator.name,
        email: userDetails?.email,
        userType: userDetails?.userType,
      };
    });

    // Return all users or those filtered by vertical
    return res
      .status(200)
      .json(
        vertical
          ? { [vertical]: collaboratorsWithDetails }
          : { allCollaborators: collaboratorsWithDetails }
      );
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
