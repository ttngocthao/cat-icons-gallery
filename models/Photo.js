const mongoose = require("mongoose");
//const uniqueValidator = require("mongoose-unique-validator");

const photoSchema = new mongoose.Schema({
  createdDate: Date,
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  extension: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
});
photoSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
//photoSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Photo", photoSchema);
