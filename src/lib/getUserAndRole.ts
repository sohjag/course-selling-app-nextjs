import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest } from "next/server";

const secret = process.env.SECRET_KEY || "";

export default function getUserAndRole(token: any) {
  try {
    if (!token) {
      return { username: null, role: null }; // Token not found, return an object with null values
    }

    const user = jwt.verify(token, secret) as JwtPayload;

    // Extract 'username' and 'role' properties, provide defaults if missing
    const username = user?.username || null;
    const role = user?.role || null;

    return { username, role }; // Return the username and role as an object
  } catch (e) {
    console.error(e);
    return { username: null, role: null }; // Return an object with null values in case of an error
  }
}
