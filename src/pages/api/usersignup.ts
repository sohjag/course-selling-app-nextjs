import { NextApiRequest, NextApiResponse } from "next";
import { ensureDbConnected } from "@/lib/dbConnect";
import { Users } from "@/lib/db";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const secret = process.env.SECRET_KEY || "";

const userSignupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password } = req.body;
  await ensureDbConnected();

  const adminRegistered = await Users.findOne({
    username,
  });

  if (adminRegistered) {
    return res.status(403).send({ message: "User already signed up" });
  } else {
    const adminObj = new Users({ username, password });
    await adminObj.save();

    const token = jwt.sign({ username, role: "user" }, secret, {
      expiresIn: "1h",
    });
    const cookies = cookie.serialize("token", token, {
      httpOnly: true,
      maxAge: 3600, // 1 hour in seconds
      sameSite: "strict",
      path: "/",
    });
    res.setHeader("Set-Cookie", cookies);

    res.json({ message: "Signed up successfully", token });
  }
};

export default userSignupHandler;
