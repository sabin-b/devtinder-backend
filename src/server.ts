import dotenv from "dotenv";
import "reflect-metadata";
import app from "./app";
import { connectDB } from "./config/db";

//? make permission to env variables to access
dotenv.config();

//? port
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

//? listen the server
connectDB()
  .then(() => {
    //? success message
    console.log(`db connected`);

    //? listen server
    app.listen(port, () =>
      console.log(`server is running on http://localhost:${port} 🚀`)
    );
  })
  .catch((err) => console.log(`db connection failed`, err));
