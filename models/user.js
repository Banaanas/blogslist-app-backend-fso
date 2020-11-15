import mongoose from "mongoose";
// To require some Schema's field to be unique
import uniqueValidator from "mongoose-unique-validator";

// To make DeprecationWarning disappear from console
mongoose.set("useFindAndModify", false);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 20,
    required: true,
  },
  username: {
    type: String,
    minlength: 5,
    maxlength: 15,
    required: true,
    unique: true, // uniqueValidator Library
  },
  passwordHash: {
    type: String,
    required: true,
  },
  //  IDs of the blogs are stored within the User document as an array of Mongo IDs
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

// Overwrites default Schema Object
// When Objects are returned -->
// Transform mongoDB "_id" (which is not a string) to string
// Transform mongoDB "_id" to "id"
// Delete "_id"
// Delete "__v"
// Delete passwordHash (should NOT BE REVEALED)
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // eslint-disable-next-line no-underscore-dangle
    returnedObject.id = returnedObject._id.toString();
    // eslint-disable-next-line no-underscore-dangle
    delete returnedObject._id;
    // eslint-disable-next-line no-underscore-dangle
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

userSchema.plugin(uniqueValidator); // uniqueValidator Library

export default mongoose.model("User", userSchema);
