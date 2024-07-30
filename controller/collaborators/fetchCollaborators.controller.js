import editorModel from "../../model/User/editor.model.js";
import viewerModel from "../../model/User/viewer.model.js";
import brandModel from "../../model/Brand/brand.model.js";

// Controller function to get editors and viewers by brand name
const fetchCollaborators = async (req, res) => {
  const { brandName } = req.params;

  try {
    // Find the brand by name
    const brand = await brandModel.findOne({ name: brandName });

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    const brandId = brand._id;

    // Find editors and viewers associated with the brandId
    const editors = await editorModel.find({ brandId });
    const viewers = await viewerModel.find({ brandId });

    return res.status(200).json({ editors, viewers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default fetchCollaborators;
