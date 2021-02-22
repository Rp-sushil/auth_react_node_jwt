const express = require("express");
const app = express();
const cors = require("cors");

// Import routes
const authRoute = require("./server/routes/auth");
const userRoute = require("./server/routes/user");

//Router MIddlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.all("*", function (req, res) {
  res.sendStatus(400);
});
module.exports = app;
