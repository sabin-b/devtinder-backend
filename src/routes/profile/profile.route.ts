import { Router } from "express";
import { verifyAuthUser } from "../../middleware";
import {
  updateUser,
  updateUserPassword,
  userProfile,
} from "./profile.controller";

const profileRouter = Router();

//? user profile
profileRouter.get("/view", verifyAuthUser, userProfile);

//? user update
profileRouter.patch("/update", verifyAuthUser, updateUser);

//? user password update
profileRouter.patch("/updatepassword", verifyAuthUser, updateUserPassword);

//? user delete
// profileRouter.delete("/:id", verifyAuthUser, deleteUser);

export default profileRouter;
