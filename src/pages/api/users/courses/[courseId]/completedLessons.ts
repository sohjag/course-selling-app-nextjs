import { NextApiRequest, NextApiResponse } from "next";
import { Users, Lessons } from "@/lib/db";
import getUserAndRole from "@/lib/getUserAndRole";
import { ensureDbConnected } from "@/lib/dbConnect";
import mongoose from "mongoose";

const completedLessonsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "GET") {
    try {
      const id = req.query.courseId;
      const courseId = new mongoose.Types.ObjectId(
        req.query.courseId?.toString() || ""
      );

      let token = req.cookies.token;
      let userAndRole = getUserAndRole(token);
      let user;
      await ensureDbConnected();

      user = await Users.findOne({ username: userAndRole.username });

      if (user && !user.purchasedCourses.includes(courseId)) {
        return res
          .status(403)
          .json({ error: "You have not purchased this course." });
      }
      if (user) {
        const completedLessonsForCourse = user.completedLessons.get(
          id as string
        );
        if (
          !completedLessonsForCourse ||
          completedLessonsForCourse.length === 0
        ) {
          return res.json({ message: "No completed lessons for this course." });
        }

        // Assuming you have a Lesson model with the Lessons variable
        const completedLessons = await Lessons.find({
          _id: { $in: completedLessonsForCourse },
        });

        res.json(completedLessons);
      }
    } catch (e) {
      return res.status(500).json({ message: "Internal error" });
    }
  } else {
    return res.status(400).json({ message: "Invalid method" });
  }
};

export default completedLessonsHandler;
