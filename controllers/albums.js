const albumRouter = require("express").Router();
const Album = require("../models/Album");
const User = require("../models/User");

albumRouter.post("/", async (req, res) => {
  const { name, createdBy } = req.body; //!when authication ready, replace createdBy with current user
  if (!name) {
    res.status(400);
    throw Error("Album name is empty");
  }
  const user = await User.findById(createdBy); //!when authication ready, replace createdBy with current user
  if (!user) {
    res.status(400);
    throw Error("User cannot be found");
  }
  try {
    const newAlbum = new Album({
      createdDate: new Date(),
      createdBy: createdBy, //userId
      name: name,
    });

    const result = await newAlbum.save();

    user.albums = [...user.albums, result._id];
    await user.save();

    res.status(201).json(result);
  } catch (error) {
    res.status(400);
    console.log(error);
    throw Error("Error in creating album");
  }
});

module.exports = albumRouter;
