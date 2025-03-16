import { Router } from "express";
import { verifyAuthUser } from "../../middleware";
import { sendConnectionRequest } from "./connectionRequest.controller";

const connectionRequestRouter = Router();

//? send request (intreseted - ignored)
connectionRequestRouter.post(
  "/send/:status/:receiverId",
  verifyAuthUser,
  sendConnectionRequest
);

export default connectionRequestRouter;
