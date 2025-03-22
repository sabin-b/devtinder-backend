import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import authRouter from "./routes/auth/auth.route";
import connectionRequestRouter from "./routes/connections/connectionRequest.route";
import profileRouter from "./routes/profile/profile.route";
import userRouter from "./routes/user/user.route";
import swaggerDocs from "./swagger/swagger";
import { globalErrorHandler } from "./utils/helpers";

//? make permission to env variables to access
dotenv.config();

//? initialize the app
const app = express();
//
//? make permission access api url
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, //? allow set cookies to browser
  })
);

//? make permission to json and formdata
app.use(express.json(), express.urlencoded({ extended: true }));

//? make permission to access cookies request object
app.use(cookieParser());

//? api docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//? routes
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/request", connectionRequestRouter);
app.use("/api/user", userRouter);

//? global 404 handling
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Sorry can't find that!" });
});

//? global error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "DEV"
        ? globalErrorHandler(err)
        : "internal server error",
  });
});

export default app;

// 24.00
