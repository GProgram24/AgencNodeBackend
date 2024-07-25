import Brand from "../../model/Brand/brand.model.js";
import Sector from "../../model/sector.model.js";

// Insert sector and subsectore data in Database
export const addSector = async (req, res) => {
    try {
        // extracting required data from request object
        const { sector, subSector, brand } = req.body;
        // check if all data required for insertion is present
        if (sector && subSector && brand && subSector.length) {
            const brandId = await Brand.findOne({ name: brand }).select("_id");
            if (brandId) {
                const saveSector = new Sector({ brandId: brandId._id, name: sector, subSector: subSector });
                saveSector.save()
                    .then(() => {
                        return res.status(201).json({ message: "Successful" });
                    })
                    // handle errors
                    .catch((err) => {
                        if (err.code == 11000) {
                            return res.status(400).json({ message: "Details already present" });
                        } else {
                            console.log("Error at adding sector, database error:", err);
                            return res.status(500).json({ message: "Server error" });
                        }
                    });
            } else {
                // If specified brand is not found
                res.status(404).json({ message: "No brand found" });
            }
        } else {
            // if required data is not recieved in request
            return res.status(422).json({ message: "Incomplete request data" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}