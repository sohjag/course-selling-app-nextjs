import { NextApiRequest, NextApiResponse } from "next";
import { ensureDbConnected } from "@/lib/dbConnect";
import { Admins } from "@/lib/db";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const secret = process.env.SECRET_KEY || "";

const adminSignupHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { username, password } = req.body;
  await ensureDbConnected();

  const adminRegistered = await Admins.findOne({
    username,
  });

  if (adminRegistered) {
    return res.status(403).send({ message: "Admin already signed up" });
  } else {
    const adminObj = new Admins({ username, password });
    await adminObj.save();

    const token = jwt.sign({ username, role: "admin" }, secret, {
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

export default adminSignupHandler;
