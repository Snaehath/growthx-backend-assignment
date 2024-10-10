require("dotenv/config");

const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

// custom modules
const errorHandler = require("./helper/error-handler");
const authJwt = require("./helper/jwt");
const userRouter = require("./routes/userRouter");
const assignmentRouter = require("./routes/assignmentRouter");

// middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(errorHandler);
app.use(authJwt());

// base route
app.get("/", (req, res) => {
  return res.status(200).json("Base route");
});

// routes
app.use("/user", userRouter);
app.use("/assignment", assignmentRouter);

// all other invalid routes
app.get("/*", (req, res) => {
  return res.status(404).json("Invalid route");
});

// database connection
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("[server] connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

// server spin up
app.listen(8000, () => {
  console.log("[server] listening on port 8000");
});
