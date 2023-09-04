import { NextApiRequest, NextApiResponse } from "next";
import { Users } from "@/lib/db";
import getUserAndRole from "@/lib/getUserAndRole";
import { ensureDbConnected } from "@/lib/dbConnect";

const purchasedCoursesHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "GET") {
    try {
      let token = req.cookies.token;
      let userAndRole = getUserAndRole(token);
      let user;
      await ensureDbConnected();

      if (userAndRole) {
        user = await Users.findOne({ username: userAndRole.username }).populate(
          "purchasedCourses"
        );
      }
      if (user) {
        //const purchased = user.purchasedCourses;
        return res.json({ purchasedCourses: user.purchasedCourses || [] });
      } else {
        return res.status(403).json({ message: "user not found" });
      }
    } catch (e) {
      return res.status(500).json({ message: "Internal error", e });
    }
  } else {
    return res.status(500).json({ message: "Invalid method" });
  }
};

export default purchasedCoursesHandler;
