import taskModel from "../../model/Project/task.model.js";

// Controller to handle task creation
const taskCreation = async (req, res) => {
  try {
    const { creatorId, contentPieces, product, targetAudience, idea } =
      req.body;

    // Validate input
    if (
      !creatorId ||
      !Array.isArray(contentPieces) ||
      !product ||
      !touchpoint ||
      !goal ||
      !targetAudience ||
      !tone ||
      !idea
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Loop through the content pieces and create a task document for each
    const tasks = contentPieces.map((contentPiece) => ({
      content: contentPiece.text,
      creator: creatorId,
      product,
      touchpoint,
      goal,
      targetAudience,
      tone,
      idea,
      // Other fields (vettedBy, editedBy) will default to null
    }));

    // Save all tasks to the database
    const createdTasks = await taskModel.insertMany(tasks);

    res
      .status(201)
      .json({ message: "Tasks created successfully", tasks: createdTasks });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export { taskCreation };