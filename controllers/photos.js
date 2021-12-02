const photoRouter = require("express").Router();
const Photo = require("../models/Photo");
const User = require("../models/User");
const multer = require("multer");
const fs = require("fs").promises;
const configStorage = (storagePath) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //  cb(null, "./images/gallery");
      cb(null, storagePath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      //if(file.mimetype==='')
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  });
  return storage;
};
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./images/gallery");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     //if(file.mimetype==='')
//     cb(null, file.fieldname + "-" + uniqueSuffix);
//   },
// });

//this is the middleware.
const upload = multer({ storage: configStorage("./images/gallery") }); //make sure to add use method for this folder in app.js

photoRouter.post("/", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) {
    throw Error("File is empty");
  }
  try {
    const { filename, mimetype, path } = file;
    const { createdBy } = req.body;

    const newPhoto = new Photo({
      name: filename,
      createdBy: createdBy,
      extension: mimetype,
      path: path,
    });

    const result = await newPhoto.save();

    const user = await User.findById(createdBy); //!when authication ready, replace createdBy with current user
    user.uploadImages = [...user.uploadImages, result._id];
    await user.save();

    res.status(201).json(result);
  } catch (error) {
    res.status(400);
    console.log(error);
    throw Error("Error in creating photo");
  }
});

module.exports = photoRouter;
