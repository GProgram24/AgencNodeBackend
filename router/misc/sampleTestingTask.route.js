import { Router } from "express";
import { restrictLiteAccountMiddleware } from "../../middleware/restrictLiteAccount.middleware.js";
import {
  divideSampleContentTask,
  getSampleTestingTask,
} from "../../controller/misc/sampleTestingTask.function.js";

const router = Router();

router.post(
  "/tasks/assign",
  restrictLiteAccountMiddleware(),
  async (req, res) => {
    const { brandName } = req.body;
    const { accountType } = req.user;

    if (!brandName) {
      return res.status(400).json({ message: "Brand name is required" });
    }

    const response = await divideSampleContentTask(brandName, accountType);

    res
      .status(201)
      .json({ message: "Task assignment successful", tasks: response });
  }
);

router.get("/tasks", getSampleTestingTask);

export const sampleTestingTaskRoutes = router;
