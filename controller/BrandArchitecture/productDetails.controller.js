import targetAudience from "../../model/targetAudience.model.js";
import productServiceMeta from "../../model/productServiceMeta.model.js";
import Sector from "../../model/sector.model.js";

// Insert sector and subsectore data in Database
export const addSector = async (req, res) => {
    try {
        // extracting required data from request object
        const { sector, subSector, productId } = req.body;
        // check if all data required for insertion is present
        if (sector && subSector && productId) {
            const saveSector = new Sector({ productServiceId: productId, name: sector, subSector: subSector });
            saveSector.save()
                .then(() => {
                    return res.status(201).json({ message: "Successful" });
                })
                // handle errors
                .catch((err) => {
                    if (err.code == 11000) {
                        return res.status(400).json({ message: "Desciption already present" });
                    } else {
                        console.log(err);
                        return res.status(500).json({ message: "Server error" });
                    }
                });
        } else {
            // if required data is not recieved in request
            return res.status(422).json({ message: "Incomplete request data" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

// Insert product details data in Database
export const addProductServiceMeta = async (req, res) => {
    try {
        // extracting required data from request object
        const { productServiceId, description, feature, attributes, usp } = req.body;
        // check if all data required for insertion is present
        if (productServiceId && description && feature && attributes && usp) {
            const addProductData = new productServiceMeta(req.body);
            addProductData.save()
                .then(() => {
                    return res.status(201).json({ message: "Successful" });
                })
                // handle errors
                .catch((err) => {
                    if (err.code == 11000) {
                        return res.status(400).json({ message: "Desciption already present" });
                    } else {
                        console.log(err);
                        return res.status(500).json({ message: "Server error" });
                    }
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
    return res.json({ message: "productdetails controller route" })
}

// Fetch all product details of a brand from Database
export const getProductDetails = async (req, res) => {
    return res.json({ message: "productdetails controller route" })
}
