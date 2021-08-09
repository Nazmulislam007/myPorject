const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const friendsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "this email already used"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Plz input validate email");
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  rePassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

friendsSchema.methods.genarateToken = async function () {
  try {
    const token = await jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    res.send(error);
  }
};

friendsSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.rePassword = await bcrypt.hash(this.password, 10);
  }
  next();
});

const FriendsList = new mongoose.model("FriendsList", friendsSchema);

module.exports = FriendsList;
