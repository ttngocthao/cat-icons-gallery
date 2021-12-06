const albumRouter = require("express").Router();
const Album = require("../models/Album");
const User = require("../models/User");
const { filterQuery } = require("../utils/filterQuery");

albumRouter.post("/", async (req, res, next) => {
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
    console.log("Error in creating album", error);
    next(error);
  }
});

//get album with filter
albumRouter.get("/", async (req, res, next) => {
  try {
    const filters = req.query;
    const albums = await Album.find({});
    const filterAlbums = filterQuery(filters, albums);
    return res.status(201).json(filterAlbums);
  } catch (error) {
    next(error);
  }
});

albumRouter.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const album = await Album.findById(id);
    if (!album) {
      throw Error("Album cannot be found");
    }
    const user = await User.findById(album.createdBy); //!when authentication ready, check if this album can be deleted by current user.

    user.albums = user.albums.filter((item) => item.id !== id);
    await user.save();
    await album.deleteOne();
    res.status(201).json({ message: "successfully deleted item" });
  } catch (error) {
    next(error);
  }
});
module.exports = albumRouter;
