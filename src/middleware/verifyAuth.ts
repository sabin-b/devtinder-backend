import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import User from "../routes/user/user.model";
import { CustomJwtPayload } from "../types/index";
import { globalErrorHandler } from "../utils/helpers";

/**
 * @description Verify the user authentication token
 * @summary verify the user authentication token and return user profile
 * @tags Auth
 * @param {Request} req - http request
 * @param {Response} res - http response
 * @param {NextFunction} next - error handler
 * @returns {Promise<void>}
 */
export const verifyAuthUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({ message: "invalid token" });
    }

    const decodedToken = jwt.verify(token, process.env.AUTH_SECRET as string);
    const userDetails = decodedToken
      ? (decodedToken as CustomJwtPayload)
      : null;

    if (!userDetails) {
      return res.status(400).json({ message: "token expired" });
    }

    //? if valid get the user profile
    const user = await User.findById(userDetails._id).select([
      "_id",
      "createdAt",
      "updatedAt",
      "firstName",
      "lastName",
      "emailId",
      "age",
      "gender",
      "imageUrl",
    ]);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // ? if user exits attached request object and forward to route
    req.authUser = user;
    next();
  } catch (error) {
    res.status(500).json({
      message:
        process.env.NODE_ENV === "dev"
          ? globalErrorHandler(error)
          : "internal server error",
    });
  }
};
