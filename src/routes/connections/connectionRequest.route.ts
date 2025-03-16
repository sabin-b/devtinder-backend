import { Router } from "express";
import { verifyAuthUser } from "../../middleware";
import {
  reviewConnectionRequest,
  sendConnectionRequest,
} from "./connectionRequest.controller";

const connectionRequestRouter = Router();

//? send request (intreseted - ignored)
connectionRequestRouter.post(
  "/send/:status/:receiverId",
  verifyAuthUser,
  sendConnectionRequest
);

//? review request (intreseted - ignored)
connectionRequestRouter.post(
  "/review/:status/:requestId",
  verifyAuthUser,
  reviewConnectionRequest
);

export default connectionRequestRouter;
