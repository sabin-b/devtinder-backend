import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import authRouter from "./routes/auth/auth.route";
import connectionRequestRouter from "./routes/connections/connectionRequest.route";
import userRouter from "./routes/user/user.route";
import swaggerDocs from "./swagger/swagger";
import { globalErrorHandler } from "./utils/helpers";

const app = express();

//? make permission to json and formdata
app.use(express.json(), express.urlencoded({ extended: true }));

//? make permission to access cookies request object
app.use(cookieParser());

//? api docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//? routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/request", connectionRequestRouter);

//? global error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "dev"
        ? globalErrorHandler(err)
        : "internal server error",
  });
});

export default app;

// 52:00
