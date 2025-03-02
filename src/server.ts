import dotenv from "dotenv";
import app from "./app";

//? make permission to env variables to access
dotenv.config();

//? port
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

//? listen the server
app.listen(port, () =>
  console.log(`server is running on http://localhost:${port} 🚀`)
);
