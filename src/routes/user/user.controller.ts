import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { validationErrorHandler } from "../../utils/helpers";
import ConnectionRequest from "../connections/connectionRequest.model";
import { UserFeedQueryStringDto } from "./user.dto";
import User from "./user.model";

const USER_DATA = [
  "_id",
  "firstName",
  "lastName",
  "emailId",
  "imageUrl",
  "age",
  "gender",
];

/**
 * @description Return the connection requests made by other users to the logged in user
 * @summary Return the connection requests made by other users to the logged in user
 * @tags Connections
 * @param {Request} req - http request
 * @param {Response} res - http response
 * @param {NextFunction} next - error handler
 * @returns {Promise<void>}
 */
export const getReceivedRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentActiveUser = req.authUser;

    //? get requests from db
    const requests = await ConnectionRequest.find({
      status: "interested",
      receiverId: currentActiveUser._id,
    }).populate("senderId", USER_DATA);

    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

/**
 * @description Return the connections of the logged in user
 * @summary Return the connections of the logged in user
 * @tags Connections
 * @param {Request} req - http request
 * @param {Response} res - http response
 * @param {NextFunction} next - error handler
 * @returns {Promise<void>}
 */
export const getConnections = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentActiveUser = req.authUser;

    //? get connections from db
    const connections = await ConnectionRequest.find({
      $or: [
        { senderId: currentActiveUser._id, status: "accepted" },
        { receiverId: currentActiveUser._id, status: "accepted" },
      ],
    })
      .populate("senderId", USER_DATA)
      .populate("receiverId", USER_DATA);

    const data = connections.map(({ receiverId, senderId }) =>
      currentActiveUser._id?.equals(senderId?._id) ? receiverId : senderId
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getFeed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.authUser;

    const requestQuery = plainToInstance(UserFeedQueryStringDto, req.query, {
      enableImplicitConversion: true,
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    });

    const errors = await validate(requestQuery);

    if (errors && errors.length) {
      return res.status(400).json({
        message: "invalid inputs",
        errors: validationErrorHandler(errors),
      });
    }

    const limit = requestQuery.limit ?? 10;
    const page = requestQuery.page ?? 1;
    const skip = (page - 1) * limit;

    // Todo:
    // wont be own card
    // wont be their connections
    // ignored connections
    // send connection requests

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          senderId: loggedInUser._id,
        },
        {
          receiverId: loggedInUser._id,
        },
      ],
    })
      .select(["senderId", "receiverId"])
      .lean();

    const hideAlreadyExistConnections = new Set(
      connectionRequests.flatMap((req) => [
        req.senderId?.toString(),
        req.receiverId?.toString(),
      ])
    ).add(loggedInUser._id?.toString());

    const users = await User.find({
      _id: { $nin: Array.from(hideAlreadyExistConnections) },
    })
      .skip(skip)
      .limit(limit)
      .lean()
      .select(USER_DATA);

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
