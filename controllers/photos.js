const photoRouter = require("express").Router();
const Photo = require("../models/Photo");
const User = require("../models/User");
const { filterQuery } = require("../utils/filterQuery");

const multer = require("multer");
const fs = require("fs");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

const configStorage = (storagePath) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //  cb(null, "./images/gallery");
      cb(null, storagePath);
    },
    filename: createFileName,
  });
  return storage;
};
const getFileExtension = (mimetype) => {
  const options = [
    { type: "image/jpeg", extension: "jpg" },
    { type: "image/png", extension: "png" },
  ];
  const myFile = options.filter((item) => item.type === mimetype);
  if (myFile.length === 0) {
    console.log("file type is not defined yet");
    return;
  }
  return myFile[0].extension;
};

const createFileName = (req, file, cb) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const fileExtension = getFileExtension(file.mimetype);
  cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
};

//this is the middleware.
const upload = multer({ storage: configStorage("./images/gallery") }); //make sure to add use method for this folder in app.js
//private route
photoRouter.post("/", upload.single("file"), async (req, res, next) => {
  const file = req.file;
  const { createdBy } = req.body;
  const user = await User.findById(createdBy); //!when authication ready, replace createdBy with current user
  if (!user) {
    throw Error("user cannot be found");
  }
  if (!file) {
    throw Error("File is empty");
  }
  try {
    const { filename, mimetype, path } = file;

    const newPhoto = new Photo({
      name: filename,
      createdBy: createdBy,
      extension: mimetype,
      path: path,
    });

    const result = await newPhoto.save();

    user.uploadImages = [...user.uploadImages, result._id];
    await user.save();

    res.status(201).json(result);
  } catch (error) {
    console.log("Error in creating photo");
    next(error);
  }
});

//public route
photoRouter.get("/", async (req, res, next) => {
  try {
    const filters = req.query;
    const photos = await Photo.find({});
    const filterPhotos = filterQuery(filters, photos);
    return res.status(201).json(filterPhotos);
  } catch (error) {
    next(error);
  }
});

photoRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findById(id);
    const user = await User.findById(photo.createdBy);
    user.uploadImages = user.uploadImages.filter((item) => item.id !== id);
    await user.save();
    await photo.deleteOne();
    //delete the file
    await unlinkAsync(photo.path);
    return res.status(201).json(photo);
  } catch (error) {
    next(error);
  }
});

module.exports = photoRouter;
