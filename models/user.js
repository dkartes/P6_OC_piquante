const mongoose = require("mongoose");
const { isEmail } = require("validator");

//creation du modele d'utilisateur
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: [isEmail],
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});

//on export le model
module.exports = mongoose.model("user", userSchema);
