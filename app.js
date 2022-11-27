require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const connectDB = require("./utils/connectToDB");

const AuthRoute = require("./Routes/Auth.route");

connectDB();
const app = express();
app.use(morgan("dev"));

app.get("/", async (req, res, next) => {
  res.send("Hello world");
});

app.use("/auth", AuthRoute);

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
});

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
