// Import model for user, 
import SampleTesting from "../../model/sampleTestingTask.model.js";
import Brand from "../../model/Brand/brand.model.js";
import Editor from "../../model/User/editor.model.js";
import Viewer from "../../model/User/viewer.model.js";
import productService from "../../model/Brand/productService.model.js";
import targetAudience from "../../model/targetAudience.model.js";

// Function to assign verticals task
export const divideSampleContentTask = async (brandName) => {
    try {
        // Get brandId
        if (brandName) {
            const brand = await Brand.findOne({ name: brandName });
            if (!brand) {
                return "Brand not found";
            }
            // Fetch users assigned with roles
            const editors = await Editor.find({ brandId: brand._id }).select(["_id", "-parentId", "-createdAt", "-updatedAt", "-__v"]);
            const viewers = await Viewer.find({ brandId: brand._id }).select(["_id", "-parentId", "-createdAt", "-updatedAt", "-__v"]);
            const creatorId = brand.managedBy; // Get creatorId to assign verticals task

            // Find products associated with the brand
            const products = await productService.find({ brand: brand._id });

            // Find required data associated with products
            const productIds = products.map(product => product._id);
            const productTargetAudience = await targetAudience.find({ productServiceId: { $in: productIds } });

            // Map the audience to products
            const productsWithAudience = products.map(product => {
                const meta = productTargetAudience.find(meta => meta.productServiceId.equals(product._id));
                return {
                    productId: product._id,
                    productName: product.name,
                    targetAudience: meta ? meta.targetAudience : []
                };
            });

            // Initialize user groups for each vertical
            const verticalGroups = {
                longForm: [creatorId],
                automation: [creatorId],
                performance: [creatorId],
                community: [creatorId]
            };

            // Add editors to respective vertical groups
            editors.forEach(editor => {
                editor.role.forEach(role => {
                    if (verticalGroups[role]) {
                        verticalGroups[role].push(editor.userId);
                    }
                });
            });

            // Add viewers to respective vertical groups
            viewers.forEach(viewer => {
                viewer.role.forEach(role => {
                    if (verticalGroups[role]) {
                        verticalGroups[role].push(viewer.userId);
                    }
                });
            });

            // create array for possible tasks
            const taskList = [];
            productsWithAudience.forEach(product => {
                product.targetAudience.forEach(audience => {
                    taskList.push({
                        productId: product.productId,
                        productName: product.productName,
                        targetAudience: [audience]
                    });
                });
            });

            // Array to assign tasks
            const taskAssign = [];

            Object.keys(verticalGroups).forEach(vertical => {
                const users = verticalGroups[vertical];
                const nUsers = users.length;
                let index = 0;
                taskList.forEach(task => {
                    taskAssign.push({
                        userId: users[index % nUsers],
                        task: task
                    })
                    index += 1;
                })
            })

            // insert assigned tasks in database
            const assignInsertResponse = await SampleTesting.insertMany(taskAssign);
            return "successful";
        }
        else { return "Invalid request"; }
    } catch (error) {
        console.log("Error at assigning verticals task:", error);
        return "Server error";
    }
}