import Brand from "../../model/Brand/brand.model.js";
import productServiceMeta from "../../model/productServiceMeta.model.js";
import productService from "../../model/Brand/productService.model.js";
import targetAudience from "../../model/targetAudience.model.js";
import mongoose from "mongoose";

const detailObject = {
    description: productServiceMeta,
    audience: targetAudience
}

// Insert/update product details data in Database
export const addProductServiceMeta = async (req, res) => {
    try {
        // extracting required data from request object
        const { productId, description, feature, attributes, usp } = req.body;
        // check if all data required for insertion is present
        if (mongoose.isValidObjectId(productId) && description && feature && attributes && usp) {
            const productData = {
                description: description,
                feature: feature,
                attributes: attributes,
                usp: usp
            };
            const options = { upsert: true, new: true, setDefaultsOnInsert: true };
            productServiceMeta.findOneAndUpdate({ productServiceId: productId }, productData, options)
                .then((result) => {
                    // Determine if the document was inserted or updated
                    console.log(result);
                    const response = result.lastErrorObject && result.lastErrorObject.upserted ? "Inserted successfully" : "Updated successfully";
                    return res.status(201).json({ message: response });
                })
                // handle errors
                .catch((err) => {
                    console.log("Error at adding/updating product description, database error:", err);
                    return res.status(500).json({ message: "Server error" });
                });
        } else {
            // if required data is not recieved in request
            return res.status(422).json({ message: "Incomplete request data" });
        }
    }
    catch (err) {
        console.log("Error at addProductServiceMeta: " + err);
        return res.status(500).json({ message: "Server error" });
    }
}

// Insert targetaudience data in Database
export const addTargetAudience = async (req, res) => {
    try {
        // Extract required data from request object
        const { productId, data } = req.body;
        // Check if all recieved data is present and valid
        if (mongoose.isValidObjectId(productId) && data && data.length) {
            const addTargetAudience = new targetAudience({
                productServiceId: productId,
                targetAudience: data
            });
            addTargetAudience.save()
                .then(() => { return res.status(201).json({ message: "successful" }); })
                .catch((err) => {
                    // If duplicate key error
                    if (err.code == 11000) {
                        return res.json({ message: "Data already present" })
                    } else {
                        console.log("Error at saving target audience, database error:", err);
                        return res.status(500).json({ message: "error" });
                    }
                })
        } else {
            // If all required data is not present in request object
            return res.status(422).json({ message: "Incomplete request data" });
        }
    } catch (err) {
        console.log("Error at addProductServiceMeta:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

// Fetch all product details of a brand from Database
export const getProductDetails = async (req, res) => {
    try {
        const { brandName } = req.params;
        const detailType = req.query.details;

        // Selecting collection required to fetch the data from
        const selectCollection = detailObject[detailType];

        if (selectCollection) {
            // Find the brandId
            const brand = await Brand.findOne({ name: brandName }).exec();
            if (!brand) {
                return res.status(404).json({ message: 'Brand not found' });
            }

            // Find products associated with the brand and populate related metadata
            const products = await productService.find({ brand: brand._id });

            // Find metadata for each product
            const productIds = products.map(product => product._id);
            const productMeta = await selectCollection.find({ productServiceId: { $in: productIds } }).exec();

            // Map the metadata to products
            if (detailType == "description") {
                const productsWithMeta = products.map(product => {
                    const meta = productMeta.find(meta => meta.productServiceId.equals(product._id));
                    return {
                        productId: product._id,
                        name: product.name,
                        description: meta ? meta.description : "",
                        feature: meta ? meta.feature : "",
                        attributes: meta ? meta.attributes : "",
                        usp: meta ? meta.usp : ""
                    };
                });
                return res.status(200).json({ message: productsWithMeta });
            } else if (detailType == "audience") {
                // Map the audience to products
                const productsWithAudience = products.map(product => {
                    const meta = productMeta.find(meta => meta.productServiceId.equals(product._id));
                    return {
                        productId: product._id,
                        name: product.name,
                        targetAudience: meta ? meta.targetAudience : []
                    };
                });
                return res.status(200).json({ message: productsWithAudience });
            }
        } else {
            return res.status(400).json({ message: "Invalid request" });
        }
    } catch (err) {
        console.log("Error at getting product:", err);
        return res.status(500).json("Server Error");
    }
}
