import express from "express";

const app = express();

//? default
app.use("/hrll", (req, res) => {
  res.json({ message: "welcome to devTinder" }).status(200);
});

app.use("/test", (req, res) =>
  res.json({ message: "welcome to root" }).status(200)
);
export default app;
