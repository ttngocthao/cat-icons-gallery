const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const albumSchema = new mongoose.Schema({
  createdDate: Date,
  name: {
    type: String,
    required: true,
    minLength: 3,
    unique: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
albumSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
albumSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Album", albumSchema);
