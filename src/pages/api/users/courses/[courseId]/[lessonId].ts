import { NextApiRequest, NextApiResponse } from "next";
import { Users } from "@/lib/db";
import { ensureDbConnected } from "@/lib/dbConnect";
import getUserAndRole from "@/lib/getUserAndRole";
import mongoose from "mongoose";

const lessonMarkingHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "PUT") {
    try {
      const id = req.query.courseId || "";
      const courseId = new mongoose.Types.ObjectId(
        req.query.courseId?.toString() || ""
      );
      const lessonId = new mongoose.Types.ObjectId(
        req.query.lessonId?.toString() || ""
      );

      let token = req.cookies.token;

      let userAndRole = getUserAndRole(token);

      let user;
      await ensureDbConnected();

      if (userAndRole) {
        user = await Users.findOne({ username: userAndRole.username });
      }
      console.log("retrieved user....", user);

      console.log("user found ", user);

      if (user && !user.purchasedCourses.includes(courseId)) {
        return res
          .status(403)
          .json({ error: "You have not purchased this course." });
      }

      let completedLessonsForCourse;
      if (user) {
        completedLessonsForCourse = user.completedLessons.get(id as string);
        if (
          completedLessonsForCourse &&
          completedLessonsForCourse.includes(lessonId)
        ) {
          return res
            .status(400)
            .json({ message: "lesson already marked complete" });
        }

        if (!completedLessonsForCourse) {
          user.completedLessons.set(id as string, []);
        }

        (user.completedLessons.get(id as string) ?? []).push(lessonId);

        await user.save();
        return res.status(200).json({ message: "Lesson marked as completed" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (e) {
      return res.status(500).json({ message: "Internal error" });
    }
  } else {
    return res.status(400).json({ message: "Invalid method" });
  }
};

export default lessonMarkingHandler;
