import { NextApiRequest, NextApiResponse } from "next";
import { Lessons, Users, Courses } from "@/lib/db";
import { ensureDbConnected } from "@/lib/dbConnect";

const lessonUpdateHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "PUT") {
    try {
      await ensureDbConnected();

      const lessonUpdated = await Lessons.findByIdAndUpdate(
        req.query.lessonId,
        req.body,
        { new: true }
      );

      if (lessonUpdated) {
        return res.status(200).json({ message: "lesson updated successfully" });
      } else {
        return res.status(404).json({ message: "Lesson not found" });
      }
    } catch (e) {
      return res.status(500).json({ message: "internal server error" });
    }
  } else if (req.method === "DELETE") {
    const lessonId = req.query.lessonId;

    try {
      await ensureDbConnected();

      // Delete the lesson from the Lessons collection
      const deletedLesson = await Lessons.findByIdAndDelete(lessonId);

      if (deletedLesson) {
        // Remove the reference to the lesson from the associated course's courseLessons array
        const courseId = deletedLesson.courseId;
        await Courses.findByIdAndUpdate(courseId, {
          $pull: { courseLessons: lessonId },
        });
        // Find all users who have completed the lesson being deleted
        const usersWithCompletedLesson = await Users.find({
          [`completedLessons.${lessonId}`]: { $exists: true },
        });
        // For each user with completed lesson, remove the completed lesson
        for (const user of usersWithCompletedLesson) {
          await Users.findByIdAndUpdate(user._id, {
            $unset: { [`completedLessons.${lessonId}`]: 1 },
          });
        }

        return res.json({ message: "Lesson deleted successfully" });
      } else {
        return res.status(404).json({ message: "Lesson not found" });
      }
    } catch (error) {
      console.error("Error while deleting lesson:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(403).json({ message: "Invalid method" });
  }
};

export default lessonUpdateHandler;
