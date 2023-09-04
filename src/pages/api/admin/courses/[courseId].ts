import { NextApiRequest, NextApiResponse } from "next";
import { Courses, Lessons, Users } from "@/lib/db";
import { ensureDbConnected } from "@/lib/dbConnect";

const courseModHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PUT") {
    try {
      await ensureDbConnected();
      const courseUpdated = await Courses.findByIdAndUpdate(
        req.query.courseId,
        req.body,
        { new: true }
      );
      if (courseUpdated) {
        return res.status(200).json({ message: "course updated successfully" });
      } else {
        return res.status(400).json({ message: "course update failed" });
      }
    } catch (e) {
      res.status(400).json({ message: "Internal error" });
    }
  } else if (req.method === "POST") {
    try {
      let course = await Courses.findById(req.query.courseId);
      if (course) {
        const lesson = new Lessons(req.body);
        await lesson.save();
        course.courseLessons.push(lesson.id);
        await course.save();
        return res
          .status(200)
          .json({ message: "Lesson added successfully", lessonId: lesson.id });
      } else {
        return res.status(404).json({ message: "course not found" });
      }
    } catch (e) {
      res.status(401).json({ message: "Internal error" });
    }
  } else if (req.method === "GET") {
    try {
      await ensureDbConnected();
      const course = await Courses.findById(req.query.courseId).populate(
        "courseLessons"
      );
      if (course) {
        return res.status(200).json({ course });
      } else {
        return res.status(404).json({ message: "Course not found" });
      }
    } catch (e) {
      return res.status(500).json({ message: "Internal error" });
    }
  } else if (req.method === "DELETE") {
    try {
      const courseId = req.query.courseId;
      await ensureDbConnected();

      // Delete the course from the Courses collection
      const deletedCourse = await Courses.findByIdAndDelete(courseId);

      if (deletedCourse) {
        const usersWithCompletedLessons = await Users.find({
          [`completedLessons.${courseId}`]: { $exists: true },
        });

        // remove the reference to the course from any user's purchasedCourses array
        await Users.updateMany(
          { purchasedCourses: courseId },
          { $pull: { purchasedCourses: courseId } }
        );

        // delete all the associated lessons for the course
        await Lessons.deleteMany({ courseId: courseId });

        // For each user with completed lessons, remove the completed lessons related to the course being deleted
        for (const user of usersWithCompletedLessons) {
          await Users.findByIdAndUpdate(user._id, {
            $unset: { [`completedLessons.${courseId}`]: 1 },
          });
        }

        return res.json({ message: "Course deleted successfully" });
      } else {
        return res.status(404).json({ message: "Course not found" });
      }
    } catch (e) {
      return res.status(500).json({ message: "Internal error" });
    }
  } else {
    return res.status(401).json({ message: "Invalid method" });
  }
};

export default courseModHandler;
