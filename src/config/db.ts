import dotenv from "dotenv";
import mongoose from "mongoose";

//? giving permission to env variables
dotenv.config();

//? connect database
export const connectDB = async () => {
  return await mongoose.connect(process.env.DB_URL as string);
};
