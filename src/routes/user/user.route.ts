import { Router } from "express";
import { verifyAuthUser } from "../../middleware";
import {
  getConnections,
  getFeed,
  getReceivedRequests,
} from "./user.controller";

const userRouter = Router();

//? check request received connections
userRouter.get("/request/received", verifyAuthUser, getReceivedRequests);

//? check own connection
userRouter.get("/connections", verifyAuthUser, getConnections);

//? all feed except own, and ignored,rejected,and not in my connection so far
userRouter.get("/feed", verifyAuthUser, getFeed);

export default userRouter;
