import { Router } from "express";
import { verifyAuthUser } from "../../middleware";
import {
  deleteUser,
  updateUser,
  updateUserPassword,
  userProfile,
} from "./user.controller";

const userRouter = Router();

//? user profile
userRouter.get("/profile/view", verifyAuthUser, userProfile);

//? user update
userRouter.patch("/profile/update", verifyAuthUser, updateUser);

//? user password update
userRouter.patch("/profile/updatepassword", verifyAuthUser, updateUserPassword);

//? user delete
userRouter.delete("/profile/:id", deleteUser);

export default userRouter;
