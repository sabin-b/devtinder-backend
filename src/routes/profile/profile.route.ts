import { Router } from "express";
import multer from "multer";
import cloudinaryStorage from "../../config/cloudinary";
import { verifyAuthUser } from "../../middleware";
import {
  updateUser,
  updateUserPassword,
  userProfile,
} from "./profile.controller";

const profileRouter = Router();
const upload = multer({ storage: cloudinaryStorage });

//? user profile
profileRouter.get("/view", verifyAuthUser, userProfile);

//? user update
profileRouter.patch(
  "/update",
  verifyAuthUser,
  upload.single("image"),
  updateUser
);

//? user password update
profileRouter.patch("/updatepassword", verifyAuthUser, updateUserPassword);

//? user delete
// profileRouter.delete("/:id", verifyAuthUser, deleteUser);

export default profileRouter;
