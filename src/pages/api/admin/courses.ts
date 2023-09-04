import { NextApiRequest, NextApiResponse } from "next";
import { Courses } from "@/lib/db";
import { ensureDbConnected } from "@/lib/dbConnect";

const coursesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const course = new Courses(req.body);
      await ensureDbConnected();
      await course.save();
      return res
        .status(200)
        .json({ message: "course created successfully", courseId: course.id });
    } catch (e) {
      res.status(401).json({ message: e });
    }
  } else {
    res.status(401).json({ message: "Invalid method" });
  }
};
export default coursesHandler;
