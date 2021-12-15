const photoRouter = require("express").Router();
const Photo = require("../models/Photo");
const User = require("../models/User");
const Album = require('../models/Album');
const sharp = require("sharp");
const path = require("path");
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
  const { createdBy,albumId } = req.body;
  const user = await User.findById(createdBy); //!when authication ready, replace createdBy with current user
  const album =albumId ?  await Album.findById(albumId) :'';

  if (!user) {
    throw Error("user cannot be found");
  }

  console.log(file);
  //resize image
  const resizeFile = await sharp(file.path)
    .resize(500, 500)
    .png({ quality: 100 })
    .toFile(`${file.destination}/${user.id}-${file.filename}`);

  
  if (!file) {
    throw Error("File is empty");
  }
  try {
    //  const { filename, mimetype, path } = file;
    console.log(resizeFile);
    //const result = resizeFile;
    const newPhoto = new Photo({
      name: `resized-${file.filename}`,
      createdBy: createdBy,
      extension: file.mimetype,
      path: `${file.destination}/${user.id}-${file.filename}`,
    });

    if(album && album!==''){
      newPhoto.album= album.id //add album id to photo
    }
    const result = await newPhoto.save();

    user.uploadImages = [...user.uploadImages, result._id];
    await user.save();
    await unlinkAsync(file.path);
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
    const photos = await Photo.find({}).populate('album');
    const filterPhotos = filterQuery(filters, photos);
    return res.status(201).json(filterPhotos);
  } catch (error) {
    next(error);
  }
});

//private route
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
//public route
photoRouter.get('/:id',async(req,res,next)=>{
  try {
    const {id} = req.params;
    const photo = await Photo.findById(id);
    return res.status(201).json(photo);
  } catch (error) {
    next(error)
  }
})
module.exports = photoRouter;
