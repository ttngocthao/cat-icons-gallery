const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 3,
    unique: true,
  },
  userName: {
    type: String,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }],
  uploadImages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Photo" }],
  // blogs:[
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref:'Blog'
  //     }
  // ]
  joinedDate: Date,
  userType: String,
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
