const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

//const blogsRouter = require('./controllers/blogs')
const userRouter = require("./controllers/users");
const albumRouter = require("./controllers/albums");
const photoRouter = require("./controllers/photos");
const loginRouter = require("./controllers/login");

if (process.env.NODE_ENV === "testWithFrontEnd") {
  mongoose
    .connect(config.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      logger.info("Test with front end test - Connected to MongoDB");
    })
    .catch((error) => {
      logger.error("error in connecting to MongoDB", error.message);
    });
}

if (
  process.env.NODE_ENV !== "test" &&
  process.env.NODE_ENV !== "testWithFrontEnd"
) {
  mongoose
    .connect(config.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      logger.info("Connected to MongoDB");
    })
    .catch((error) => {
      logger.error("error in connecting to MongoDB", error.message);
    });
}

app.use(cors());
//app.use(express.static('build'))
app.use(express.json());

app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
app.get("/", (_req, res) => {
  res.send("cat icon gallerty");
}); //for testing the hosting service
app.use("/images/gallery", express.static("./images/gallery"));
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/albums", albumRouter);
app.use("/api/photos", photoRouter);
//app.use('/api/blogs',blogsRouter)

if (process.env.NODE_ENV === "testWithFrontEnd") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
