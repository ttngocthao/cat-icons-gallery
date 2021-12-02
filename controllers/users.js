const userRouter = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

userRouter.post("/", async (req, res) => {
  /**
   * !check if password are given
   * !!check if username and password are at least 3 characters long
   * !!!must give the suitable status codes and error messages
   */
  const body = req.body;
  if (!body.password) {
    res.status(400);
    throw Error("Password cannot be empty");
  }
  if (body.password && body.password.length < 3) {
    res.status(400);
    throw Error("Password must be at least 3 characters long");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const newUser = new User({
    email: body.email,
    userName: body.userName,
    passwordHash,
  });

  const result = await newUser.save();

  res.status(201).json(result);
});

userRouter.get("/", async (req, res) => {
  // const result = await User.find({}).populate('blogs',{url:1,title:1,author:1})
  const result = await User.find({}).populate("album");
  if (!result) throw Error("There is no user in the database");

  res.status(200).json(result.map((user) => user.toJSON()));
});

module.exports = userRouter;
