import bcrypt from "bcryptjs";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { validationErrorHandler } from "../../utils/helpers";
import User from "../user/user.model";
import { SiginInDto, SignupDto } from "./auth.dto";

/**
 * @description User Signup
 * @summary Create a new user account
 * @tags Auth
 * @param {Request} req - http request
 * @param {Response} res - http response
 * @param {NextFunction} next - error handler
 * @returns {Promise<void>}
 */
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //? check logged in user trying to create new user
    const loggedInUser = req.authUser;

    if (loggedInUser) {
      return res.status(400).json({ message: "you are already loggedIn" });
    }

    //? sanitize the inputs
    const userInputs = plainToInstance(SignupDto, req.body, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });

    const errors = await validate(userInputs);

    if (errors && errors.length > 0) {
      return res.status(406).json({
        message: "inValid inputs",
        errors: validationErrorHandler(errors),
      });
    }

    //? email already exits
    const userAlreadyExists = await User.findOne({
      emailId: userInputs.emailId,
    });

    if (userAlreadyExists) {
      return res.status(400).json({ message: "emailAddress already exists" });
    }

    //? hash password
    const { password, ...otherValues } = userInputs;
    const hashedPassword = await bcrypt.hash(userInputs.password, 10);

    //? if not create a user
    await User.create({
      password: hashedPassword,
      ...otherValues,
    });

    res.status(201).json({ message: "user created" });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Signin an existing user
 * @summary Signin an existing user and return a success message
 * @tags Auth
 * @param {Request} req - http request
 * @param {Response} res - http response
 * @param {NextFunction} next - error handler
 * @returns {Promise<void>}
 */
export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //? validating user inputs
    const userInputs = plainToInstance(SiginInDto, req.body, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });

    const inputErrors = await validate(userInputs);

    if (inputErrors && inputErrors.length > 0) {
      return res.status(400).json({
        message: "invalid inputs",
        errors: validationErrorHandler(inputErrors),
      });
    }

    //? check that user exits
    const existingUser = await User.findOne({ emailId: userInputs.emailId });

    if (!existingUser) {
      return res.status(404).json({ message: "invalid credentials" });
    }

    //? if exits check the password
    const isValidPassword = await existingUser.validatePassword(
      userInputs.password
    );

    if (!isValidPassword) {
      return res.status(404).json({ message: "invalid credentials" });
    }

    //? generate token
    const token = existingUser.getJwt();

    //? success response
    res.cookie("token", token, {
      expires: new Date(new Date().setDate(new Date().getDate() + 1)),
    });

    const successMessage =
      "welcome to devTinder" + " " + existingUser.firstName;
    res.status(200).json({ message: successMessage });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Log out the user and remove the auth token
 * @summary remove the user auth token
 * @tags Auth
 * @param {Request} req - http request
 * @param {Response} res - http response
 * @returns {Response} - success message
 */
export const signOut = (req: Request, res: Response) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .status(200)
    .json({ message: "logout successfull" });
};
