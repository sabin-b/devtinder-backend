import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import {
  handleSelfRequestErrorhandler,
  validationErrorHandler,
} from "../../utils/helpers";
import User from "../user/user.model";
import { ConnectionRequestParamsDto } from "./connectionRequest.dto";
import ConnectionRequest from "./connectionRequest.model";

export const sendConnectionRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //? sanitize the params

    const requestParams = plainToInstance(
      ConnectionRequestParamsDto,
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
    const isSameUser = handleSelfRequestErrorhandler(
      req.authUser._id!,
      requestParams.receiverId
    );

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
