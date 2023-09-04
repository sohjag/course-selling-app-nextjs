import { ensureDbConnected } from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import { Courses } from "@/lib/db";

const browseCourses = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      await ensureDbConnected();
      const courses = await Courses.find({}).populate("courseLessons");
      if (courses) {
        return res.status(200).json({ courses });
      } else {
        return res.status(400).json({ message: "no courses found" });
      }
    } catch (e) {
      return res.status(500).json({ message: "Internal error" });
    }
  } else {
    return res.status(400).json({ message: "Invalid request method" });
  }
};

export default browseCourses;
