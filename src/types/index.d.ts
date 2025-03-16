import { JwtPayload } from "jsonwebtoken";
import { IUserDocument } from "./types";

declare global {
  namespace Express {
    interface Request {
      authUser: IUserDocument;
    }
  }
}

interface CustomJwtPayload extends JwtPayload {
  _id: string;
}
