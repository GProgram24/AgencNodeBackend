import editorModel from "../../model/User/editor.model.js";
import viewerModel from "../../model/User/viewer.model.js";
import brandModel from "../../model/Brand/brand.model.js";

// Controller function to get editors and viewers by brand name and group them by roles
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

    // Initialize an object to hold the collaborators grouped by roles
    const collaborators = {
      longform: [],
      automation: [],
      community: [],
      performance: [],
    };

    // Group editors by their roles
    editors.forEach((editor) => {
      editor.role.forEach((role) => {
        if (collaborators[role]) {
          collaborators[role].push(editor);
        }
      });
    });

    // Group viewers by their roles
    viewers.forEach((viewer) => {
      viewer.role.forEach((role) => {
        if (collaborators[role]) {
          collaborators[role].push(viewer);
        }
      });
    });

    return res.status(200).json(collaborators);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default fetchCollaborators;
