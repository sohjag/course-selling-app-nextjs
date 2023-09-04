import { NextApiRequest, NextApiResponse } from "next";
import { ensureDbConnected } from "@/lib/dbConnect";
import { Users } from "@/lib/db";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const secret = process.env.SECRET_KEY || "";

const userLoginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { username, password } = req.body;
    await ensureDbConnected();

    const adminRegistered = await Users.findOne({
      username,
      password,
    });

    if (adminRegistered) {
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

      res.json({ message: "logged in successfully", token });
    } else {
      res.status(403).send({ message: "Invalid username or password" });
    }
  } else {
    res.status(400).json({ message: "Invalid method" });
  }
};

export default userLoginHandler;
