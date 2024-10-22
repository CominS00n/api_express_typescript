import { Request, Response, Router } from "express";

import { db } from "../../config/connectDB";
import { log_activity } from "../../schema/log_activity";

import { authenticateToken } from "../../middleware/authenticateToken";

const route = Router();

// type LogActivity = {
//   activityUser: string;
//   activityDetails: string;
//   activityDate: string;
// };

// route.post("/log_activity", async (req: Request, res: Response) => {
//   try {
//     const { username, activity } = req.body;

//     const data: LogActivity = {
//       activityUser: username,
//       activityDetails: activity,
//       activityDate: new Date().toISOString(),
//     };

//     await db.insert(log_activity).values(data).execute();
//     res.status(201).json({ message: "Activity logged" });
//   } catch (error) {
//     console.error("Error logging activity:", error);
//     res.status(500).json({ error: "Error logging activity", message: error });
//   }
// });

route.get(
  "/log_activity", authenticateToken, async (req: Request, res: Response) => {
    try {
      const activities = await db.select().from(log_activity).execute();
      res.status(200).json(activities);
    } catch (error) {
      console.error("Error getting activities:", error);
      res
        .status(500)
        .json({ error: "Error getting activities", message: error });
    }
  }
);

export default route;
