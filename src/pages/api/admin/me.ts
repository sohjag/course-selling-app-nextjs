import { NextApiResponse, NextApiRequest } from "next";
import jwt from "jsonwebtoken";

const secret = process.env.SECRET_KEY || "";

//redundant endpoint - use role/me instead - to be removed
const meHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      let token = req.cookies.token;
      if (!token) {
        return res.status(400).json({ message: "Token not found" });
      }
      jwt.verify(token, secret, (err, user) => {
        if (err) {
          return res.status(400).json({ message: "Token verification failed" });
        }
        return res.status(200).json(user);
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Internal error" });
    }
  } else {
    return res.status(400).json({ message: "Invalid method" });
  }
};

export default meHandler;
