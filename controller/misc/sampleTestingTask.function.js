import mongoose from "mongoose";
import SampleTesting from "../../model/sampleTestingTask.model.js";
import Brand from "../../model/Brand/brand.model.js";
import Editor from "../../model/User/editor.model.js";
import Viewer from "../../model/User/viewer.model.js";
import productService from "../../model/Brand/productService.model.js";
import targetAudience from "../../model/targetAudience.model.js";

// Function to assign verticals task based on accountType (Pro/Lite)
export const divideSampleContentTask = async (brandName, accountType) => {
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

      // Initialize vertical groups for the task assignment
      const verticalGroups = {
        longForm: [creatorId],
        automation: [creatorId],
        performance: [creatorId],
        community: [creatorId],
      };

      // For Pro accounts, add editors and viewers to vertical groups
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
      } else if (accountType === "lite") {
        // Explicit handling for Lite accounts: only the creator receives tasks
        console.log(
          "Lite account detected: All tasks will be assigned to the creator."
        );
      }

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

      // Assign tasks to relevant users in a round-robin manner
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
  } catch (error) {
    console.log("Error at assigning vertical tasks:", error);
    return "Server error";
  }
};

export const getSampleTestingTask = async (req, res) => {
  try {
    const { userId } = req.body;
    if (mongoose.isValidObjectId(userId)) {
      const tasks = await SampleTesting.find({ userId: userId });
      return res.status(200).json({ message: tasks });
    } else {
      return res.status(401).json({ message: "Invalid user" });
    }
  } catch (error) {
    console.log("Error at fetching sample testing task:", error);
    res.json({ message: "Server error" });
  }
};
