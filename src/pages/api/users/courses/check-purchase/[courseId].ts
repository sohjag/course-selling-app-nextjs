import { NextApiRequest, NextApiResponse } from "next";
import { Users, Courses } from "@/lib/db";
import mongoose from "mongoose";
import { ensureDbConnected } from "@/lib/dbConnect";
import getUserAndRole from "@/lib/getUserAndRole";

const userCourseHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const courseId = new mongoose.Types.ObjectId(
        req.query.courseId?.toString() || ""
      );
      await ensureDbConnected();

      let token = req.cookies.token;
      let userAndRole = getUserAndRole(token);

      let user;
      if (userAndRole) {
        user = await Users.findOne({ username: userAndRole.username });
      }

      if (!user) {
        return res.status(403).json({ message: "user not found" });
      }

      const isCoursePurchased = user.purchasedCourses.includes(courseId);
      return res.json({ purchased: isCoursePurchased });
    } catch (error) {
      return res.status(500).json({ message: "Internal error", error });
    }
  } else if (req.method === "POST") {
    const courseId = new mongoose.Types.ObjectId(
      req.query.courseId?.toString() || ""
    );
    await ensureDbConnected();

    const courseFound = await Courses.findById(courseId);
    if (!courseFound) {
      return res.status(404).json({ message: "Course not found" });
    }

    let token = req.cookies.token;
    let userAndRole = getUserAndRole(token);

    let user;
    if (userAndRole) {
      user = await Users.findOne({ username: userAndRole.username });
    }

    if (!user) {
      return res.status(403).json({ message: "user not found" });
    }

    // If the user already purchased the course, return a message indicating it.
    if (user.purchasedCourses.includes(courseId)) {
      return res.status(200).json({ message: "Course already purchased" });
    }

    // If the course is not purchased yet, add it to the user's purchasedCourses array and save.
    user.purchasedCourses.push(courseId);
    await user.save();

    return res.status(200).json({ message: "Course purchased successfully" });
  } else {
    return res.status(400).json({ message: "Invalid request method" });
  }
};

export default userCourseHandler;
