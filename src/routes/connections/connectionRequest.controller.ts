import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { validationErrorHandler } from "../../utils/helpers";
import User from "../user/user.model";
import {
  ReviewConnectionRequestParamsDto,
  SendConnectionRequestParamsDto,
} from "./connectionRequest.dto";
import ConnectionRequest from "./connectionRequest.model";

/**
 * @description send a connection request
 * @summary send a connection request to another user
 * @tags Connections
 * @param {Request} req - http request
 * @param {Response} res - http response
 * @param {NextFunction} next - error handler
 * @returns {Promise<void>}
 */
export const sendConnectionRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //? sanitize the params

    const requestParams = plainToInstance(
      SendConnectionRequestParamsDto,
      req.params,
      {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
        exposeUnsetFields: false,
      }
    );

    const errors = await validate(requestParams);

    if (errors && errors.length > 0) {
      return res.status(400).json({
        message: "invalid params",
        errors: validationErrorHandler(errors),
      });
    }

    //? receiverid is exits in db
    const receiverUserExists = await User.findById(requestParams.receiverId);

    if (!receiverUserExists) {
      return res.status(404).json({ message: "user not found" });
    }

    //? if make connection request same user to self prevent that
    // const isSameUser = validateMongoDbObjectId(
    //   req.authUser._id!,
    //   requestParams.receiverId
    // );

    const isSameUser = req.authUser._id?.equals(requestParams.receiverId);

    if (isSameUser) {
      return res
        .status(400)
        .json({ message: "you are making connection request your self" });
    }
    //? old requests exits
    const oldRequestConnectionExists = await ConnectionRequest.findOne({
      $or: [
        { receiverId: requestParams.receiverId, senderId: req.authUser._id },
        { receiverId: req.authUser._id, senderId: requestParams.receiverId },
      ],
    });

    if (oldRequestConnectionExists) {
      return res
        .status(400)
        .json({ message: "connection request already exists" });
    }

    //? create new connection
    const newConnection = await ConnectionRequest.create({
      senderId: req.authUser._id,
      receiverId: requestParams.receiverId,
      status: requestParams.status,
    });

    res.status(201).json({
      message: "connection request sent successfully",
      data: newConnection,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Review a connection request made by another user
 * @summary Review a connection request made by another user and update the status of the request
 * @tags Connections
 * @param {Request} req - http request
 * @param {Response} res - http response
 * @param {NextFunction} next - error handler
 * @returns {Promise<void>}
 * @example
 * @review connection request
 * @endpoint: /connections/review/:status/:requestId
 * @method: patch
 * @status: "accepted" or "rejected"
 * @requestId: connection request id
 */
export const reviewConnectionRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //? sanitize the params
    const requestParams = plainToInstance(
      ReviewConnectionRequestParamsDto,
      req.params,
      {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
        exposeUnsetFields: false,
      }
    );

    const errors = await validate(requestParams);

    if (errors && errors.length > 0) {
      return res.status(400).json({
        message: "invalid params",
        errors: validationErrorHandler(errors),
      });
    }

    //? check review connection found
    const reviewConnectionReqExists = await ConnectionRequest.findOne({
      _id: requestParams.requestId,
      receiverId: req.authUser._id,
      status: "interested",
    });

    if (!reviewConnectionReqExists) {
      return res.status(400).json({ message: "there is no requests found" });
    }

    const updatedRequest = await ConnectionRequest.findByIdAndUpdate(
      reviewConnectionReqExists._id,
      {
        status: requestParams.status,
      },
      {
        returnDocument: "after",
      }
    );
    res.status(202).send({
      message: `connection request ${requestParams.status} successfully`,
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};
