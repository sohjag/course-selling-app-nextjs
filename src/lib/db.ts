import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Courses" }],
  completedLessons: {
    type: Map,
    of: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lessons" }],
    default: {},
  },
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
  courseLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lessons" }],
});

const lessonSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
  title: String,
  description: String,
  lessonLink: String,
});

export const Users = mongoose.model("Users", userSchema);
export const Admins = mongoose.model("Admins", adminSchema);
export const Courses = mongoose.model("Courses", courseSchema);
export const Lessons = mongoose.model("Lessons", lessonSchema);
