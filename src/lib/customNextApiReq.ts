import { NextApiRequest } from "next";

interface CustomNextApiReq extends NextApiRequest {
  user?: string;
  role?: string;
}

export default CustomNextApiReq;
