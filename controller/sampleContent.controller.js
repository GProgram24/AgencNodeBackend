// Import model for user, 
import Brand from "../model/sampleTesting.model.js";
import Editor from "../model/User/editor.model.js";
import Viewer from "../model/User/viewer.model.js";
import productService from "../model/Brand/productService.model.js";
import targetAudience from "../model/targetAudience.model.js";

// Define platforms
const platforms = {
    longForm: ["medium", "blogs", "quora"],
    automation: ["sms", "email", "notification"],
    performance: ["instagram post", "facebook post", "twitter post", "threads post", "google ads"],
    community: ["discord", "reddit", "whatsapp community", "telegram channel", "instagram channel"],
}

// Function to assign verticals task
export const divideSampleContentTask = async (brandName) => {

    // Get brandId
    const brand = await Brand.findOne({ name: brandName });

    // Fetch users assigned with roles
    const editors = await Editor.find({ brandId: brand._id });
    const viewers = await Viewer.find({ brandId: brand._id });
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
            name: product.name,
            targetAudience: meta ? meta.targetAudience : []
        };
    });
    return productsWithAudience;
}

const assignResult = await divideSampleContentTask("Tide");
console.log(assignResult);