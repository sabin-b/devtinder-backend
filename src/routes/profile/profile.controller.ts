import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { cloudinary } from "../../config/cloudinary";
import { validationErrorHandler } from "../../utils/helpers";
import User from "../user/user.model";
import { DeleteDto, UpdateDto, UpdatePasswordDto } from "./profile.dto";

/**
 * @description update an existing user
 * @summary update an existing user and return a success message
 * @tags Auth
 * @param {Request} req - http request
 * @param {Response} res - http response
 * @param {NextFunction} next - error handler
 * @returns {Promise<void>}
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentActiveUser = req.authUser;
    const inputs = {
      ...req.body,
      image: req.body.image || req.file?.path,
      imagePublicId: req.file?.filename || undefined,
    };

    //? check the req.body values
    const userInputs = plainToInstance(UpdateDto, inputs, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });

    const errors = await validate(userInputs);

    if (errors && errors.length > 0) {
      return res.status(400).json({
        message: "invalid inputs",
        errors: validationErrorHandler(errors),
      });
    }

    //? remove old profile image from cloudinary ,when we upload new profile image
    if (req.file && currentActiveUser.imagePublicId) {
      await cloudinary.uploader.destroy(
        currentActiveUser.imagePublicId as string
      );
    }

    //? if user exits update their details
    const updatedUser = await User.findByIdAndUpdate(
      currentActiveUser._id,
      userInputs
    ).select([
      "_id",
      "createdAt",
      "updatedAt",
      "firstName",
      "lastName",
      "age",
      "gender",
      "image",
      "imagePublicId",
      "about",
      "emailId",
    ]);

    res
      .status(202)
      .json({ message: "profile details updated", user: updateUser });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Return the user profile information
 * @summary Return the user profile information
 * @tags Auth
 * @param {Request} req - http request
 * @param {Response} res - http response
 * @param {NextFunction} next - error handler
 * @returns {Promise<void>}
 */
export const userProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json(req.authUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * @description Update the user password
 * @summary Update the user password
 * @tags Auth
 * @param {Request} req - http request
 * @param {Response} res - http response
 * @param {NextFunction} next - error handler
 * @returns {Promise<void>}
 */
export const updateUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //? validate input fields
    const userInputs = plainToInstance(UpdatePasswordDto, req.body, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });

    const errors = await validate(userInputs);

    if (errors && errors.length > 0) {
      return res.status(400).json({
        message: "invalid inputs",
        errors: validationErrorHandler(errors),
      });
    }

    //? logged in user from request object
    const activeCurrentUser = req.authUser;

    //? find userDocument by Active User
    const validUser = await User.findById(activeCurrentUser._id);

    // ? if old password is valid
    const isPasswordValid = await validUser?.validatePassword(
      userInputs.oldPassword
    );

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "please enter the correct old password" });
    }

    //? if valid update password on db

    // ? before hash new password
    const NewHashPassword = await activeCurrentUser.hashPassword(
      userInputs.newPassword
    );
    

    await User.findByIdAndUpdate(activeCurrentUser._id, {
      password: NewHashPassword,
    });

    res.status(202).json({ message: "password updated successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * @description delete a user by id
 * @param {Request} req - http request
 * @param {Response} res - http response
 * @param {NextFunction} next - error handler
 * @returns {Promise<void>}
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const params = plainToInstance(DeleteDto, req.params, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });

    const errors = await validate(params);

    if (errors && errors.length > 0) {
      return res.status(400).json({
        message: "invalid inputs",
        errors: validationErrorHandler(errors),
      });
    }

    //? check user exists in db
    const userExists = await User.findById(params.id);

    if (!userExists) {
      return res.status(404).json({ message: "user not found" });
    }

    //? if user exists
    await User.findByIdAndDelete(userExists._id);

    //? send the response
    res.status(202).json({ message: "user deleted" });
  } catch (error) {
    next(error);
  }
};
